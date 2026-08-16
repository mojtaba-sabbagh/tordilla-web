// lib/zip.ts
// Minimal ZIP reader/writer built on Node's zlib, so media backups are ordinary
// .zip files that can be opened and extracted with any tool. Only what we need:
// stored/deflated entries, no Zip64, no encryption, no directory entries.
import { deflateRawSync, inflateRawSync } from 'zlib';

export type ZipEntry = { name: string; data: Buffer };

const LOCAL_SIG = 0x04034b50;
const CENTRAL_SIG = 0x02014b50;
const EOCD_SIG = 0x06054b50;
const METHOD_STORE = 0;
const METHOD_DEFLATE = 8;
const UTF8_FLAG = 0x0800; // filenames are UTF-8 (uploads may contain Persian)

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i++) {
    crc = CRC_TABLE[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date: Date) {
  const year = Math.max(date.getFullYear(), 1980);
  return {
    time:
      ((date.getHours() & 0x1f) << 11) |
      ((date.getMinutes() & 0x3f) << 5) |
      ((date.getSeconds() >> 1) & 0x1f),
    date: (((year - 1980) & 0x7f) << 9) | (((date.getMonth() + 1) & 0xf) << 5) | (date.getDate() & 0x1f),
  };
}

export function createZip(entries: ZipEntry[], modifiedAt = new Date()): Buffer {
  const { time, date } = dosDateTime(modifiedAt);
  const chunks: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuffer = Buffer.from(entry.name, 'utf8');
    const crc = crc32(entry.data);

    // Only keep the compressed form when it is actually smaller (already-compressed
    // JPEG/PNG uploads usually grow when deflated).
    const deflated = deflateRawSync(entry.data);
    const useDeflate = deflated.length < entry.data.length;
    const payload = useDeflate ? deflated : entry.data;
    const method = useDeflate ? METHOD_DEFLATE : METHOD_STORE;

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(LOCAL_SIG, 0);
    localHeader.writeUInt16LE(20, 4); // version needed
    localHeader.writeUInt16LE(UTF8_FLAG, 6);
    localHeader.writeUInt16LE(method, 8);
    localHeader.writeUInt16LE(time, 10);
    localHeader.writeUInt16LE(date, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(payload.length, 18);
    localHeader.writeUInt32LE(entry.data.length, 22);
    localHeader.writeUInt16LE(nameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28); // extra length

    chunks.push(localHeader, nameBuffer, payload);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(CENTRAL_SIG, 0);
    centralHeader.writeUInt16LE(20, 4); // version made by
    centralHeader.writeUInt16LE(20, 6); // version needed
    centralHeader.writeUInt16LE(UTF8_FLAG, 8);
    centralHeader.writeUInt16LE(method, 10);
    centralHeader.writeUInt16LE(time, 12);
    centralHeader.writeUInt16LE(date, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(payload.length, 20);
    centralHeader.writeUInt32LE(entry.data.length, 24);
    centralHeader.writeUInt16LE(nameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30); // extra
    centralHeader.writeUInt16LE(0, 32); // comment
    centralHeader.writeUInt16LE(0, 34); // disk number
    centralHeader.writeUInt16LE(0, 36); // internal attrs
    centralHeader.writeUInt32LE(0, 38); // external attrs
    centralHeader.writeUInt32LE(offset, 42);

    central.push(centralHeader, nameBuffer);
    offset += localHeader.length + nameBuffer.length + payload.length;
  }

  const centralBuffer = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(EOCD_SIG, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralBuffer.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...chunks, centralBuffer, eocd]);
}

export function readZip(buffer: Buffer): ZipEntry[] {
  // The end-of-central-directory record sits at the tail, after an optional comment.
  let eocdOffset = -1;
  for (let i = buffer.length - 22; i >= 0; i--) {
    if (buffer.readUInt32LE(i) === EOCD_SIG) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset < 0) {
    throw new Error('فایل ZIP معتبر نیست.');
  }

  const entryCount = buffer.readUInt16LE(eocdOffset + 10);
  let pointer = buffer.readUInt32LE(eocdOffset + 16);
  const entries: ZipEntry[] = [];

  for (let i = 0; i < entryCount; i++) {
    if (buffer.readUInt32LE(pointer) !== CENTRAL_SIG) {
      throw new Error('ساختار فهرست فایل ZIP خراب است.');
    }

    const method = buffer.readUInt16LE(pointer + 10);
    const crc = buffer.readUInt32LE(pointer + 16);
    const compressedSize = buffer.readUInt32LE(pointer + 20);
    const uncompressedSize = buffer.readUInt32LE(pointer + 24);
    const nameLength = buffer.readUInt16LE(pointer + 28);
    const extraLength = buffer.readUInt16LE(pointer + 30);
    const commentLength = buffer.readUInt16LE(pointer + 32);
    const localOffset = buffer.readUInt32LE(pointer + 42);
    const name = buffer.subarray(pointer + 46, pointer + 46 + nameLength).toString('utf8');

    if (buffer.readUInt32LE(localOffset) !== LOCAL_SIG) {
      throw new Error(`هدر فایل «${name}» در آرشیو خراب است.`);
    }

    // The local header repeats the name/extra lengths and they may differ from
    // the central directory, so the data start has to be computed from it.
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    const payload = buffer.subarray(dataStart, dataStart + compressedSize);

    let data: Buffer;
    if (method === METHOD_STORE) {
      data = Buffer.from(payload);
    } else if (method === METHOD_DEFLATE) {
      data = inflateRawSync(payload);
    } else {
      throw new Error(`روش فشرده‌سازی فایل «${name}» پشتیبانی نمی‌شود.`);
    }

    if (data.length !== uncompressedSize || crc32(data) !== crc) {
      throw new Error(`فایل «${name}» در آرشیو سالم نیست.`);
    }

    entries.push({ name, data });
    pointer += 46 + nameLength + extraLength + commentLength;
  }

  return entries;
}
