import React from "react";
import type { TradeLogType } from "../../types/TradeLogType";
import { FaExchangeAlt } from "react-icons/fa";
import TradeLogWindow from "./TradeLogWindow";

const TradeLogDetail: React.FC<TradeLogType> = (tradeDetail) => {
  const [player1, player2] = tradeDetail.details;

  const player1Items = tradeDetail.items.filter(
    (item) => item.idPlayer === player1.idPlayer
  );
  const player2Items = tradeDetail.items.filter(
    (item) => item.idPlayer === player2.idPlayer
  );

  console.log(player1Items);
  return (
    <div
      id="tradeLogWindow"
      className="flex flex-col items-center justify-between w-full rounded-lg p-2 bg-brand  "
    >
      <TradeLogWindow
        key={`trade-log-window-1`}
        detail={player1}
        items={player1Items}
        penya={player2.penya}
      />
      <div className="w-full my-2 flex items-center justify-center">
        <FaExchangeAlt size={14} className="text-accent-gold" />
      </div>
      <TradeLogWindow
        key={`trade-log-window-2`}
        detail={player2}
        items={player2Items}
        penya={player1.penya}
      />
    </div>
  );
};

export default TradeLogDetail;
