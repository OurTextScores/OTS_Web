##
## Set preload/embedded files
##

option(EMBED_PRELOADS "Embed preload files in the .js file, otherwise pack into a separate .data file." OFF)

if (EMBED_PRELOADS)
    SET (PRELOAD_TYPE_FLAG "--embed-file")
else (EMBED_PRELOADS)
    SET (PRELOAD_TYPE_FLAG "--preload-file")
endif (EMBED_PRELOADS)

set(_preload_files
    fonts/musejazz/MuseJazzText.woff2
    fonts/campania/Campania.woff2
    fonts/edwin/Edwin-Roman.woff2
    fonts/edwin/Edwin-Bold.woff2
    fonts/edwin/Edwin-Italic.woff2
    fonts/edwin/Edwin-BdIta.woff2
    fonts/mscoreTab.woff2
    fonts/mscore-BC.woff2
    fonts/leland/LelandText.woff2
    fonts/bravura/BravuraText.woff2
    fonts/gootville/GootvilleText.woff2
    fonts/mscore/MScoreText.woff2
    fonts/petaluma/PetalumaText.woff2
    fonts/petaluma/PetalumaScript.woff2
    fonts/finalemaestro/FinaleMaestroText.woff2
    fonts/finalebroadway/FinaleBroadwayText.woff2

    fonts/leland/Leland.woff2
    fonts/leland/metadata.json

    fonts/bravura/Bravura.woff2
    fonts/bravura/metadata.json
    
    fonts/mscore/mscore.woff2
    fonts/mscore/metadata.json

    fonts/gootville/Gootville.woff2
    fonts/gootville/metadata.json

    fonts/musejazz/MuseJazz.woff2
    fonts/musejazz/metadata.json

    fonts/petaluma/Petaluma.woff2
    fonts/petaluma/metadata.json

    fonts/finalemaestro/FinaleMaestro.woff2
    fonts/finalemaestro/metadata.json
    fonts/finalebroadway/FinaleBroadway.woff2
    fonts/finalebroadway/metadata.json

    fonts/smufl/glyphnames.json
    fonts/smufl/ranges.json
    fonts/fonts_tablature.xml
    fonts/fonts_figuredbass.xml

    fonts/FreeSans.woff2
    fonts/FreeSerif.woff2
    fonts/FreeSerifBold.woff2
    fonts/FreeSerifItalic.woff2
    fonts/FreeSerifBoldItalic.woff2
)
foreach(_file ${_preload_files})
    set(WASM_LINK_FLAGS "${WASM_LINK_FLAGS} ${PRELOAD_TYPE_FLAG} ${MU_ROOT}/${_file}@/${_file}")
endforeach()

set(WASM_LINK_FLAGS "${WASM_LINK_FLAGS} ${PRELOAD_TYPE_FLAG} ${MU_ROOT}/src/engraving/data/styles@/engraving/styles")

# set(WASM_LINK_FLAGS "${WASM_LINK_FLAGS} ${PRELOAD_TYPE_FLAG} ${MU_ROOT}/share/styles@/styles")
set(WASM_LINK_FLAGS "${WASM_LINK_FLAGS} ${PRELOAD_TYPE_FLAG} ${MU_ROOT}/share/styles/chords_std.xml@/styles/chords_std.xml")
set(WASM_LINK_FLAGS "${WASM_LINK_FLAGS} ${PRELOAD_TYPE_FLAG} ${MU_ROOT}/share/instruments/instruments.xml@/instruments.xml")

set(WASM_LINK_FLAGS "${WASM_LINK_FLAGS} ${PRELOAD_TYPE_FLAG} ${MU_ROOT}/src/framework/mpe/resources@/mpe")

set(WASM_LINK_FLAGS "${WASM_LINK_FLAGS} -s LZ4=1") # compress the data package
