
#include "global/log.h"
#include "./score.h"

engraving::MasterScore* MainScore::maybeUseExcerpt(engraving::MasterScore* score, int excerptId) {
    // -1 means the full score
    if (excerptId < 0) {
        return score;
    }

    // excerptId >= 0
    auto excerpts = score->excerpts();

    if (excerptId >= (int)excerpts.size()) {
        LOGE() << String(u"Not a valid excerptId. (excerptId: %1)").arg(excerptId);
        throw;
    }

    LOGI() << String(u"useExcerpt: %1").arg(excerptId);
    return (engraving::MasterScore*) excerpts[excerptId]->excerptScore();
}
