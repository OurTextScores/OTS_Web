
set(MODULE importexport)

set(MODULE_SRC
    ${MU_ROOT}/src/project/internal/notationreadersregister.cpp
    ${MU_ROOT}/src/project/internal/notationreadersregister.h
    ${MU_ROOT}/src/project/internal/notationwritersregister.cpp
    ${MU_ROOT}/src/project/internal/notationwritersregister.h

    ${MU_ROOT}/src/notation/internal/notation.cpp
    ${MU_ROOT}/src/notation/internal/notation.h
    ${MU_ROOT}/src/notation/internal/notationelements.cpp
    ${MU_ROOT}/src/notation/internal/notationelements.h
    ${MU_ROOT}/src/notation/internal/notationpainting.cpp
    ${MU_ROOT}/src/notation/internal/notationpainting.h
    ${MU_ROOT}/src/notation/internal/notationviewstate.cpp
    ${MU_ROOT}/src/notation/internal/notationviewstate.h
    ${MU_ROOT}/src/notation/internal/notationundostack.cpp
    ${MU_ROOT}/src/notation/internal/notationundostack.h
    ${MU_ROOT}/src/notation/internal/searchcommandsparser.cpp
    ${MU_ROOT}/src/notation/internal/searchcommandsparser.h

    ${MU_ROOT}/src/notation/internal/mscnotationwriter.cpp
    ${MU_ROOT}/src/notation/internal/mscnotationwriter.h

    ${MU_ROOT}/src/notation/internal/masternotation.cpp
    ${MU_ROOT}/src/notation/internal/masternotation.h
    ${MU_ROOT}/src/notation/internal/excerptnotation.cpp
    ${MU_ROOT}/src/notation/internal/excerptnotation.h
    ${MU_ROOT}/src/notation/internal/notationplayback.cpp
    ${MU_ROOT}/src/notation/internal/notationplayback.h
    ${MU_ROOT}/src/notation/internal/masternotationparts.cpp
    ${MU_ROOT}/src/notation/internal/masternotationparts.h
    ${MU_ROOT}/src/notation/internal/notationparts.cpp
    ${MU_ROOT}/src/notation/internal/notationparts.h
    
    positionjsonwriter.cpp
    positionjsonwriter.h
)

add_subdirectory(${MU_ROOT}/src/importexport/musicxml musicxml)
set(MODULE_LINK ${MODULE_LINK} iex_musicxml)

add_subdirectory(${MU_ROOT}/src/importexport/guitarpro guitarpro)
set(MODULE_LINK ${MODULE_LINK} iex_guitarpro)

add_subdirectory(${MU_ROOT}/src/importexport/midi midi)
add_subdirectory(${MU_ROOT}/thirdparty/beatroot beatroot)
set(MODULE_LINK ${MODULE_LINK} iex_midi)
set(MODULE_LINK ${MODULE_LINK} beatroot)

add_subdirectory(${MU_ROOT}/src/importexport/imagesexport imagesexport)
set(MODULE_LINK ${MODULE_LINK} iex_imagesexport)

include(SetupModule)
