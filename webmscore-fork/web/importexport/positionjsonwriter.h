/*
 * SPDX-License-Identifier: GPL-3.0-only
 * MuseScore-CLA-applies
 *
 * MuseScore
 * Music Composition & Notation
 *
 * Copyright (C) 2021 MuseScore BVBA and others
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

#ifndef MU_POSITIONJSONWRITER_H
#define MU_POSITIONJSONWRITER_H

#include "modularity/ioc.h"
#include "project/inotationwriter.h"

namespace mu::engraving {
class Score;
}

namespace mu::notation {
class PositionJsonWriter : public project::INotationWriter
{
public:
    enum class ElementType {
        SEGMENT,
        MEASURE
    };

    explicit PositionJsonWriter() = default;
    explicit PositionJsonWriter(ElementType elementType);

    std::vector<UnitType> supportedUnitTypes() const override;
    bool supportsUnitType(UnitType unitType) const override;

    Ret write(notation::INotationPtr notation, QIODevice& device, const Options& options = Options()) override;
    Ret writeList(const INotationPtrList& notations, QIODevice& device, const Options& options = Options()) override;

    QByteArray jsonData(engraving::Score* score);
    QByteArray jsonData(INotationPtr notation);

private:
    qreal pngDpiResolution() const;
    QHash<void*, int> elementIds(const mu::engraving::Score* score) const;

    void writeElementsPositions(QJsonObject& json, const mu::engraving::Score* score) const;
    void writeSegmentsPositions(QJsonObject& json, const mu::engraving::Score* score) const;
    void writeMeasuresPositions(QJsonObject& json, const mu::engraving::Score* score) const;

    void writeEventsPositions(QJsonObject& json, const mu::engraving::Score* score) const;

    ElementType m_elementType = ElementType::SEGMENT;
};
}

#endif // MU_POSITIONJSONWRITER_H
