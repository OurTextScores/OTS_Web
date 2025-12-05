
#include "global/log.h"
#include "async/processevents.h"

#include "audio/internal/worker/playback.h"
#include "audio/internal/worker/audioengine.h"

#include "./audiosynth.h"

namespace MainAudio {

/**
 * De-interleave audio channels
 * @param dest: [ channelA #len frames, channelB #len frames ]
 * @param src:  [ channelA frame0, channelB frame0, channelA frame1, channelB frame1, ... ]
 */
void deInterleave(float* dest, const float* src, size_t framesLen) {
    for (size_t i = 0, j = 0; i < framesLen; i++, j+=2) {
        dest[i] = src[j];
        dest[framesLen + i] = src[j+1];
    }
}

const char* Synth::processBatch(int batchSize, bool cancel) {
    auto resArr = (SynthRes**)calloc(batchSize, sizeof(SynthRes*)); // array of pointers to SynthRes data 
    for (int i = 0; i < batchSize; i++) {
        resArr[i] = (*synthFn)(cancel);
    }
    return reinterpret_cast<const char*>(resArr);
}

Synth Synth::start(MainScore score, float starttime) {
    LOGI() << String(u"starttime %1").arg(starttime);

    // use buffer size of 512 frames
    static const size_t renderStep = 512;
    static const size_t channels = 2;
    static const size_t sampleRate = 44100;

    // Wait async ticks, otherwise `sequenceIdList` is empty
    //  previous `Playback::addSequence()` is a `Promise`
    mu::async::processEvents();
    //  resolve `totalDuration`
    mu::async::processEvents();

    auto playback = modularity::ioc()->resolve<audio::Playback>("");
    IF_ASSERT_FAILED (playback->getSequences().size() > 0) {
        LOGE() << "no playback sequence found!";
        return nullptr;
    }
    audio::ITrackSequencePtr sequence = playback->getSequences().at(0); // use only the first `sequence`

    // Seek
    // https://github.com/LibreScore/webmscore/blob/v4.0/src/framework/audio/internal/worker/audiooutputhandler.cpp#L200-L201
    sequence->player()->stop();
    sequence->player()->seek(starttime * 1000); // get ms

    // Setup audio source
    // https://github.com/LibreScore/webmscore/blob/v4.0/src/framework/audio/internal/soundtracks/soundtrackwriter.cpp#L73-L76
    audio::AudioEngine::instance()->setMode(audio::RenderMode::OfflineMode);
    auto source = audio::AudioEngine::instance()->mixer();
    source->setSampleRate(sampleRate);
    source->setIsActive(true);

    // https://github.com/LibreScore/webmscore/blob/v4.0/src/framework/audio/internal/soundtracks/soundtrackwriter.cpp#L49
    const auto totalDuration = sequence->player()->duration();
    const audio::samples_t totalSamples = (totalDuration / 1000000.f) * sampleRate;
    LOGI() << String(u"totalDuration %1, totalSamples %2").arg(totalDuration).arg((int64_t)totalSamples);

    bool done = false;
    audio::samples_t playedSamples = starttime * sampleRate;
    auto synthIterator = [done, playedSamples, totalSamples, source](bool cancel = false) mutable -> SynthRes* { // must use by-copy capture because variables are destroyed as the `_synthAudio` function ends
        if (done) {
            return new SynthRes{done, -1, -1, 0, {}};
        }

        float buffer[renderStep * channels] = {};
        auto res = (SynthRes*)calloc(1, sizeof(SynthRes) + sizeof(buffer)); 
        res->chunkSize = sizeof(buffer);

        // render audio buffer
        source->process(buffer, renderStep);
        deInterleave((float*)res->chunk, buffer, renderStep);

        auto prevPlayed = playedSamples;
        playedSamples += renderStep;
        if (playedSamples >= totalSamples || cancel) {
            // finished, do cleanup
            source->setIsActive(false);
            done = true;
        }

        res->done = done;
        res->startTime = float(prevPlayed) / sampleRate;
        res->endTime = float(playedSamples) / sampleRate;

        return res;
    };

    // persist this `synthIterator` function
    synthIterators.push_back(synthIterator);

    return Synth(&synthIterators.back());
}

} // namespace MainAudio
