// Axios & Types
export { axiosService } from "./axios";
export * from "./types";

// Services
export { authService } from "./auth.service";
export { userService } from "./user.service";
export { gameCategoryService } from "./gameCategory.service";
export { gameAccountService } from "./gameAccount.service";
export { orderService } from "./order.service";
export { transactionService } from "./transaction.service";
export { walletService } from "./wallet.service";
export { mediaService } from "./media.service";
export { sellRequestService } from "./sellRequest.service";
export { supportTicketService } from "./supportTicket.service";
export { accountTradeService } from "./accountTrade.service";
export { websiteSettingService } from "./websiteSetting.service";

// Default export for all services
import { authService } from "./auth.service";
import { userService } from "./user.service";
import { gameCategoryService } from "./gameCategory.service";
import { gameAccountService } from "./gameAccount.service";
import { orderService } from "./order.service";
import { transactionService } from "./transaction.service";
import { walletService } from "./wallet.service";
import { mediaService } from "./media.service";
import { sellRequestService } from "./sellRequest.service";
import { supportTicketService } from "./supportTicket.service";
import { accountTradeService } from "./accountTrade.service";
import { websiteSettingService } from "./websiteSetting.service";

export const services = {
  auth: authService,
  user: userService,
  gameCategory: gameCategoryService,
  gameAccount: gameAccountService,
  order: orderService,
  transaction: transactionService,
  wallet: walletService,
  media: mediaService,
  sellRequest: sellRequestService,
  supportTicket: supportTicketService,
  accountTrade: accountTradeService,
  websiteSetting: websiteSettingService,
};
