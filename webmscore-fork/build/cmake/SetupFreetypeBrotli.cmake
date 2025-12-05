##
## FreeType v2.10.2
##
set(USE_SYSTEM_FREETYPE ON)

set(BROTLIDEC_FOUND TRUE)
set(BROTLIDEC_LIBRARIES brotlidec-static brotlicommon-static)
set(BROTLIDEC_INCLUDE_DIRS ${MU_ROOT}/thirdparty/brotli/c/include)
set(SKIP_INSTALL_ALL TRUE)

add_compile_definitions(FT_CONFIG_OPTION_USE_BROTLI)

include_directories(${MU_ROOT}/thirdparty/freetype-2-10/include)

subdirs(
    ${MU_ROOT}/thirdparty/brotli
    ${MU_ROOT}/thirdparty/freetype-2-10
)
