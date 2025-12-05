
set(LIBSND_PATH ${MU_ROOT}/thirdparty/libsndfile/src)
# set(LIBOGG_PATH "" CACHE PATH "Path to libogg sources")
# set(LIBVORBIS_PATH "" CACHE PATH "Path to libogg sources")
set(SNDFILE_INCDIR ${LIBSND_PATH}/../include)
set(SNDFILE_LIB sndfile)

add_library(sndfile
    ${LIBSND_PATH}/sndfile.c
    ${LIBSND_PATH}/../include/sndfile.hh
    ${LIBSND_PATH}/command.c
    ${LIBSND_PATH}/common.c
    ${LIBSND_PATH}/common.h
    ${LIBSND_PATH}/au.c
    ${LIBSND_PATH}/caf.c
    ${LIBSND_PATH}/file_io.c
    ${LIBSND_PATH}/ogg.c
    ${LIBSND_PATH}/ogg_vorbis.c
    # ${LIBSND_PATH}/wav.c

    ${LIBSND_PATH}/broadcast.c
    ${LIBSND_PATH}/dither.c
    ${LIBSND_PATH}/strings.c
    ${LIBSND_PATH}/id3.c
    ${LIBSND_PATH}/float32.c
    ${LIBSND_PATH}/double64.c
    ${LIBSND_PATH}/cart.c

    # ${LIBSND_PATH}/pcm.c
	# ${LIBSND_PATH}/ulaw.c
	# ${LIBSND_PATH}/alaw.c
	# ${LIBSND_PATH}/float32.c
	# ${LIBSND_PATH}/double64.c
	# ${LIBSND_PATH}/ima_adpcm.c
	# ${LIBSND_PATH}/ms_adpcm.c
	# ${LIBSND_PATH}/gsm610.c
	# ${LIBSND_PATH}/dwvw.c
	# ${LIBSND_PATH}/vox_adpcm.c
	# ${LIBSND_PATH}/interleave.c
	# ${LIBSND_PATH}/strings.c
	# ${LIBSND_PATH}/dither.c
	# ${LIBSND_PATH}/cart.c
	# ${LIBSND_PATH}/broadcast.c
	# ${LIBSND_PATH}/audio_detect.c
 	# ${LIBSND_PATH}/ima_oki_adpcm.c
	# ${LIBSND_PATH}/ima_oki_adpcm.h
	# ${LIBSND_PATH}/alac.c
	# ${LIBSND_PATH}/chunk.c
	# ${LIBSND_PATH}/ogg.h
	# ${LIBSND_PATH}/chanmap.h
	# ${LIBSND_PATH}/chanmap.c
	# ${LIBSND_PATH}/id3.h
	# ${LIBSND_PATH}/id3.c
	# ${LIBSND_PATH}/aiff.c
	# ${LIBSND_PATH}/avr.c
	# ${LIBSND_PATH}/dwd.c
	# ${LIBSND_PATH}/flac.c
	# ${LIBSND_PATH}/g72x.c
	# ${LIBSND_PATH}/htk.c
	# ${LIBSND_PATH}/ircam.c
	# ${LIBSND_PATH}/macos.c
	# ${LIBSND_PATH}/mat4.c
	# ${LIBSND_PATH}/mat5.c
	# ${LIBSND_PATH}/nist.c
	# ${LIBSND_PATH}/paf.c
	# ${LIBSND_PATH}/pvf.c
	# ${LIBSND_PATH}/raw.c
	# ${LIBSND_PATH}/rx2.c
	# ${LIBSND_PATH}/sd2.c
	# ${LIBSND_PATH}/sds.c
	# ${LIBSND_PATH}/svx.c
	# ${LIBSND_PATH}/txw.c
	# ${LIBSND_PATH}/voc.c
	# ${LIBSND_PATH}/wve.c
	# ${LIBSND_PATH}/w64.c
	# ${LIBSND_PATH}/wavlike.h
	# ${LIBSND_PATH}/wavlike.c
	# ${LIBSND_PATH}/wav.c
	# ${LIBSND_PATH}/xi.c
	# ${LIBSND_PATH}/mpc2k.c
	# ${LIBSND_PATH}/rf64.c
	# ${LIBSND_PATH}/ogg_speex.c
	# ${LIBSND_PATH}/ogg_pcm.c
	# ${LIBSND_PATH}/ogg_opus.c
	# ${LIBSND_PATH}/ogg_vcomment.h
	# ${LIBSND_PATH}/ogg_vcomment.c
	# ${LIBSND_PATH}/nms_adpcm.c
	# ${LIBSND_PATH}/mpeg.c
	# ${LIBSND_PATH}/mpeg_decode.c
	# ${LIBSND_PATH}/mpeg_l3_encode.c
	# ${LIBSND_PATH}/GSM610/config.h
	# ${LIBSND_PATH}/GSM610/gsm.h
	# ${LIBSND_PATH}/GSM610/gsm610_priv.h
	# ${LIBSND_PATH}/GSM610/add.c
	# ${LIBSND_PATH}/GSM610/code.c
	# ${LIBSND_PATH}/GSM610/decode.c
	# ${LIBSND_PATH}/GSM610/gsm_create.c
	# ${LIBSND_PATH}/GSM610/gsm_decode.c
	# ${LIBSND_PATH}/GSM610/gsm_destroy.c
	# ${LIBSND_PATH}/GSM610/gsm_encode.c
	# ${LIBSND_PATH}/GSM610/gsm_option.c
	# ${LIBSND_PATH}/GSM610/long_term.c
	# ${LIBSND_PATH}/GSM610/lpc.c
	# ${LIBSND_PATH}/GSM610/preprocess.c
	# ${LIBSND_PATH}/GSM610/rpe.c
	# ${LIBSND_PATH}/GSM610/short_term.c
	# ${LIBSND_PATH}/GSM610/table.c
	# ${LIBSND_PATH}/G72x/g72x.h
	# ${LIBSND_PATH}/G72x/g72x_priv.h
	# ${LIBSND_PATH}/G72x/g721.c
	# ${LIBSND_PATH}/G72x/g723_16.c
	# ${LIBSND_PATH}/G72x/g723_24.c
	# ${LIBSND_PATH}/G72x/g723_40.c
	# ${LIBSND_PATH}/G72x/g72x.c
	# ${LIBSND_PATH}/ALAC/ALACAudioTypes.h
	# ${LIBSND_PATH}/ALAC/ALACBitUtilities.h
	# ${LIBSND_PATH}/ALAC/EndianPortable.h
	# ${LIBSND_PATH}/ALAC/aglib.h
	# ${LIBSND_PATH}/ALAC/dplib.h
	# ${LIBSND_PATH}/ALAC/matrixlib.h
	# ${LIBSND_PATH}/ALAC/alac_codec.h
	# ${LIBSND_PATH}/ALAC/shift.h
	# ${LIBSND_PATH}/ALAC/ALACBitUtilities.c
	# ${LIBSND_PATH}/ALAC/ag_dec.c
	# ${LIBSND_PATH}/ALAC/ag_enc.c
	# ${LIBSND_PATH}/ALAC/dp_dec.c
	# ${LIBSND_PATH}/ALAC/dp_enc.c
	# ${LIBSND_PATH}/ALAC/matrix_dec.c
	# ${LIBSND_PATH}/ALAC/matrix_enc.c
	# ${LIBSND_PATH}/ALAC/alac_decoder.c
	# ${LIBSND_PATH}/ALAC/alac_encoder.c

    # #ogg
    # ${LIBOGG_PATH}/include/ogg/ogg.h
    # ${LIBOGG_PATH}/include/ogg/os_types.h
    # ${LIBOGG_PATH}/src/bitwise.c
    # ${LIBOGG_PATH}/src/framing.c

    # #vorbis
    # ${LIBVORBIS_PATH}/lib/vorbisenc.c
    # ${LIBVORBIS_PATH}/lib/info.c
    # ${LIBVORBIS_PATH}/lib/analysis.c
    # ${LIBVORBIS_PATH}/lib/bitrate.c
    # ${LIBVORBIS_PATH}/lib/block.c
    # ${LIBVORBIS_PATH}/lib/codebook.c
    # ${LIBVORBIS_PATH}/lib/envelope.c
    # ${LIBVORBIS_PATH}/lib/floor0.c
    # ${LIBVORBIS_PATH}/lib/floor1.c
    # ${LIBVORBIS_PATH}/lib/lookup.c
    # ${LIBVORBIS_PATH}/lib/lpc.c
    # ${LIBVORBIS_PATH}/lib/lsp.c
    # ${LIBVORBIS_PATH}/lib/mapping0.c
    # ${LIBVORBIS_PATH}/lib/mdct.c
    # ${LIBVORBIS_PATH}/lib/psy.c
    # ${LIBVORBIS_PATH}/lib/registry.c
    # ${LIBVORBIS_PATH}/lib/res0.c
    # ${LIBVORBIS_PATH}/lib/sharedbook.c
    # ${LIBVORBIS_PATH}/lib/smallft.c
    # ${LIBVORBIS_PATH}/lib/vorbisfile.c
    # ${LIBVORBIS_PATH}/lib/window.c
    # ${LIBVORBIS_PATH}/lib/synthesis.c
    )

target_include_directories(sndfile PUBLIC
    ${LIBSND_PATH}
    ${LIBSND_PATH}/../include
    # ${LIBOGG_PATH}/include
    # ${LIBVORBIS_PATH}/include
    # ${LIBVORBIS_PATH}/lib
    )

target_compile_definitions(sndfile PRIVATE
    CPU_IS_BIG_ENDIAN=0
    CPU_IS_LITTLE_ENDIAN=1
    CPU_CLIPS_POSITIVE=0
    CPU_CLIPS_NEGATIVE=0
    OS_IS_WIN32=0
    HAVE_EXTERNAL_XIPH_LIBS=1
    HAVE_UNISTD_H=1
    HAVE_FSTAT64=1
    HAVE_FSYNC=1
    HAVE_DECL_S_IRGRP=1
    PACKAGE_NAME="libsndfile"
    PACKAGE_VERSION="1.2.0"
)

