
#ifndef MAIN_SCORE_H
#define MAIN_SCORE_H

#include "engraving/libmscore/masterscore.h"
#include "engraving/libmscore/excerpt.h"
using namespace mu;

struct MainScore {
public:
    MainScore(uintptr_t score_ptr, int excerptId = -1) {
        auto _score = reinterpret_cast<engraving::MasterScore*>(score_ptr);
        score = maybeUseExcerpt(_score, excerptId);
    }

    inline operator engraving::MasterScore*() {
        return score;
    }

    inline engraving::MasterScore* operator->() {
        return score;
    }

private:
    engraving::MasterScore* score;

    static engraving::MasterScore* maybeUseExcerpt(engraving::MasterScore* score, int excerptId);
};

#endif // MAIN_SCORE_H
