
set(MODULE MainAudio)

set(ENABLE_AUDIO_EXPORT ON)

set(MODULE_SRC
    audio.cpp
    audio.h
    audiosynth.cpp
    audiosynth.h

    ${MU_ROOT}/src/playback/internal/playbackcontroller.cpp
    ${MU_ROOT}/src/playback/internal/playbackcontroller.h
    ${MU_ROOT}/src/playback/internal/soundprofilesrepository.cpp
    ${MU_ROOT}/src/playback/internal/soundprofilesrepository.h
)

set(MODULE_INCLUDE
    ${MU_ROOT}/src/framework/audio
)

add_subdirectory(${MU_ROOT}/src/framework/audio          audio)
add_subdirectory(${MU_ROOT}/src/importexport/audioexport audioexport)

set(MODULE_LINK
    audio
    iex_audioexport
)

include(SetupModule)
