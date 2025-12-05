
CPUS	  := $(shell getconf _NPROCESSORS_ONLN 2>/dev/null || getconf NPROCESSORS_ONLN 2>/dev/null || echo 1)
MU_ROOT	  := $(dir ${CURDIR})

# EMBED_PRELOADS = "OFF"
# BUILD_NUMBER   = $(shell git rev-parse --short=7 HEAD)

# change path to include your Qt5 installation
export CMAKE_PREFIX_PATH	=	../../build.qt5/5.15.2/wasm_32

# setup ccache
export CCACHE_BASEDIR		=	${MU_ROOT}
export CCACHE_DIR			=	${MU_ROOT}/.ccache
export CCACHE_COMPRESS		=	true

export NODE_OPTIONS			=	--max_old_space_size=4096

release:
	if test ! -d build.release; then mkdir build.release; fi; \
	  cd build.release;                                        \
	  emcmake cmake -DCMAKE_BUILD_TYPE=RELEASE	                \
	  -DEMBED_PRELOADS="${EMBED_PRELOADS}"                       \
	  -DCMAKE_TOOLCHAIN_FILE="${CMAKE_TOOLCHAIN_FILE}"            \
	  -DCMAKE_BUILD_NUMBER="${BUILD_NUMBER}" ..;                   \
	  emmake make -j ${CPUS};                                       \
	  mv ./webmscore.* ../../web-public;                             \

debug:
	if test ! -d build.debug; then mkdir build.debug; fi; \
	  cd build.debug;                                      \
	  emcmake cmake -DCMAKE_BUILD_TYPE=DEBUG	            \
	  -DEMBED_PRELOADS="${EMBED_PRELOADS}"                   \
	  -DCMAKE_TOOLCHAIN_FILE="${CMAKE_TOOLCHAIN_FILE}"        \
	  -DCMAKE_BUILD_NUMBER="${BUILD_NUMBER}" ..;               \
	  emmake make -j ${CPUS};                                   \
	  mv ./webmscore.* ../../web-public;                         \

#
# clean out of source build
#
clean:
	-rm -rf build.debug build.release
	-rm -rf ../web-public/.cache
	-rm ../web-public/webmscore.*

clean-ccache:
	-rm -rf ../.ccache
