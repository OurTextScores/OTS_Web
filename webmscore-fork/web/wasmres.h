
#ifndef MAIN_WASMRES_H
#define MAIN_WASMRES_H

#include <stdint.h>

#include "global/types/bytearray.h"
#include "global/io/buffer.h"
#include "global/types/ret.h"
#include "global/types/string.h"
using namespace mu;

typedef const uint8_t* WasmResBytes;

/**
 * Pack wasm responses
 */
struct WasmRes {
public:
    WasmRes(ByteArray data, Ret ret = make_ok());

    WasmRes(QByteArray data)
        : WasmRes(ByteArray::fromQByteArrayNoCopy(data)) {}

    WasmRes(String str)
        : WasmRes(str.toUtf8()) {}

    WasmRes(uint32_t num)
        : WasmRes(numberToByteArray(num)) {}

    WasmRes()
        : WasmRes(ByteArray()) {}

    inline operator WasmResBytes() {
        return (WasmResBytes)reallocData(m_buffer.data());
    }

    static WasmRes fromRet(Ret ret) {
        // set data to the error message
        ByteArray data = String::fromStdString(ret.toString()).toUtf8();
        return WasmRes(data, ret);
    }

private:
    io::Buffer m_buffer;

    static const char* reallocData(ByteArray data);

    static inline ByteArray numberToByteArray(uint32_t num) {
        return ByteArray((const char*)&num, sizeof(num));
    }
};

#endif // MAIN_WASMRES_H
