#!/bin/bash

FLAGS=(
    --flavor=woff2
    --symbol-cmap
    --layout-features='*'
    --notdef-glyph --notdef-outline --recommended-glyphs
    --desubroutinize
    --no-hinting
    --unicodes='*'
)

FILES=(
    #  text fonts
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
    # fonts/mscore/MusescoreIcon.woff2 # ignoring, used in UI icons only (icon font)
    fonts/petaluma/PetalumaText.woff2
    fonts/petaluma/PetalumaScript.woff2
    fonts/finalebroadway/FinaleBroadwayText.woff2
    fonts/finalemaestro/FinaleMaestroText.woff2

    #  music fonts
    fonts/leland/Leland.woff2
    fonts/bravura/Bravura.woff2    
    fonts/mscore/mscore.woff2
    fonts/gootville/Gootville.woff2
    fonts/musejazz/MuseJazz.woff2
    fonts/petaluma/Petaluma.woff2
    fonts/finalebroadway/FinaleBroadway.woff2
    fonts/finalemaestro/FinaleMaestro.woff2

    #  general-purpose fonts
    fonts/FreeSans.woff2
    fonts/FreeSerif.woff2
    fonts/FreeSerifBold.woff2
    fonts/FreeSerifItalic.woff2
    fonts/FreeSerifBoldItalic.woff2
)

cd ..
du -c -h ${FILES[@]}

for f in ${FILES[@]}
do
   pyftsubset $f --output-file="$f-" ${FLAGS[@]}
   mv "$f-" $f
done

du -c -h ${FILES[@]}
