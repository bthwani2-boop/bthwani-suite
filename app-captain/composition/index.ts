import {
  DshEntryScreen,
} from '../../dsh/frontend/app-captain/DshCaptainEntryScreen';
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
} from '../../dsh/frontend/app-captain/DshCaptainOrdersScreen';
import {
  DshCaptainSupportDirectoryScreen,
  DshCaptainChatReadAckScreen,
  DshCaptainChatSendScreen,
} from '../../dsh/frontend/app-captain/DshCaptainOperationsScreen';
import { DshCaptainCodBalanceScreen } from '../../dsh/frontend/app-captain/DshCaptainFinanceScreen';
import { DshCaptainProfileGetScreen, DshCaptainTierEvaluateScreen, DshCaptainTierInfoScreen } from '../../dsh/frontend/app-captain/DshCaptainProfileScreen';

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
