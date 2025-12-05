
#ifndef MAINAUDIO_SYNTH_H
#define MAINAUDIO_SYNTH_H

#include <functional>
#include "../score.h"

namespace MainAudio {

class Synth {
public:
    struct SynthRes {
        int done;  // bool
        float startTime; // the chunk's start time in seconds
        float endTime;   // the chunk's end time in seconds (playtime)
        unsigned chunkSize;
        char chunk[0 /* to be chunkSize */];
    };

    typedef std::function<SynthRes*(bool)>* SynthFnPtr;

    Synth(SynthFnPtr f)
        : synthFn(f) {}

    Synth(uintptr_t fn_ptr) {
        synthFn = reinterpret_cast<SynthFnPtr>(fn_ptr);
    };

    inline operator uintptr_t() {
        return reinterpret_cast<uintptr_t>(synthFn);
    }

    inline const char* process(bool cancel) {
        const auto res = (*synthFn)(cancel);
        return reinterpret_cast<const char*>(res);
    }

    const char* processBatch(int batchSize, bool cancel);

    /**
     * synthesize audio frames
     * @param starttime The start time offset in seconds
     */
    static Synth start(MainScore score, float starttime);

private:
    SynthFnPtr synthFn = nullptr;

    // can't use std::set<std::function<>>
    // https://stackoverflow.com/questions/53459693
    static std::vector<std::function<SynthRes*(bool)>> synthIterators;
};

} // namespace MainAudio

#endif // MAINAUDIO_SYNTH_H
