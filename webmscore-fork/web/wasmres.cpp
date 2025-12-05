
#include "./wasmres.h"

WasmRes::WasmRes(ByteArray data, Ret ret)  {
    m_buffer.open(io::Buffer::ReadWrite);

    // write error code
    m_buffer.write(numberToByteArray(ret.code()));

    // write data
    uint32_t size = data.size();
    m_buffer.write(numberToByteArray(size));
    m_buffer.write(data);

    m_buffer.close();
}

/**
 * realloc/copy the data block so that it can be properly referred by its ptr and then freed in c-style
 */
const char* WasmRes::reallocData(ByteArray data) {
    auto size = data.size() + 1; // https://doc.qt.io/qt-5/qbytearray.html#data
    auto buf = (char*)malloc(size);
    memcpy(buf, data.constData(), size);
    return buf;
}
