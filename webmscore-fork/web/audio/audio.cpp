
#include "audio/audiomodule.h"
#include "importexport/audioexport/audioexportmodule.h"

#include "playback/internal/playbackcontroller.h"
#include "playback/internal/playbackconfiguration.h"
#include "playback/internal/soundprofilesrepository.h"

namespace MainAudio {
using namespace mu;

void initModule() {
    // Setup audio engine
    auto aeM = new audio::AudioModule();
    aeM->registerExports();
    aeM->resolveImports();
    auto playbackController = new playback::PlaybackController();
    modularity::ioc()->registerExport<playback::IPlaybackController>("", playbackController);
    modularity::ioc()->registerExport<playback::ISoundProfilesRepository>("", new playback::SoundProfilesRepository());
    playbackController->init();
    aeM->onInit(framework::IApplication::RunMode::Converter);

    auto audioM = new iex::audioexport::AudioExportModule();
    audioM->registerExports();
    audioM->resolveImports();
    audioM->onInit(framework::IApplication::RunMode::Converter);
}

} // namespace MainAudio
