import {
  DshEntryScreen,
} from '../../dsh/frontend/app-captain/entry';
import {
  CaptainDeliveryConfirmSheet,
  CaptainPickupConfirmSheet,
  CaptainOrderDetailScreen,
  DshCaptainOrderChatScreen,
  DshCaptainBellScreen,
  CaptainOrdersInboxScreen,
  DshCaptainOrderAcceptScreen,
  DshCaptainOrderDeliverScreen,
  DshCaptainOrderDetailsScreen,
  DshCaptainOrderGetScreen,
  DshCaptainOrderPickupScreen,
  DshCaptainOrdersListScreen,
  DshCaptainOrdersOffersListScreen,
  DshCaptainProofUploadScreen,
} from '../../dsh/frontend/app-captain/orders';
import {
  DshCaptainSupportDirectoryScreen,
  DshCaptainChatReadAckScreen,
  DshCaptainChatSendScreen,
} from '../../dsh/frontend/app-captain/operations';
import { DshCaptainCodBalanceScreen } from '../../dsh/frontend/app-captain/finance';
import { DshCaptainProfileGetScreen, DshCaptainTierEvaluateScreen, DshCaptainTierInfoScreen } from '../../dsh/frontend/app-captain/profile';

export const dshCaptain = {
  entry: {
    DshEntryScreen,
  },
  orders: {
    CaptainDeliveryConfirmSheet,
    CaptainPickupConfirmSheet,
    CaptainOrderDetailScreen,
    DshCaptainOrderChatScreen,
    DshCaptainBellScreen,
    CaptainOrdersInboxScreen,
  },
  operations: {
    DshCaptainSupportDirectoryScreen,
    DshCaptainChatReadAckScreen,
    DshCaptainChatSendScreen,
    DshCaptainOrderAcceptScreen,
    DshCaptainOrderDeliverScreen,
    DshCaptainOrderDetailsScreen,
    DshCaptainOrderGetScreen,
    DshCaptainOrderPickupScreen,
    DshCaptainOrdersListScreen,
    DshCaptainOrdersOffersListScreen,
    DshCaptainProofUploadScreen,
  },
  finance: {
    DshCaptainCodBalanceScreen,
  },
  profile: {
    DshCaptainProfileGetScreen,
    DshCaptainTierEvaluateScreen,
    DshCaptainTierInfoScreen,
  },
} as const;
