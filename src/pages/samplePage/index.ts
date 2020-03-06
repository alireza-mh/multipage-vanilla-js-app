import TextStructure from "src/components/TextStructure";
import { generateSegmentedNumber } from "src/utils/number";
import { getTime, getDate } from "src/utils/date";
import fail from './images/fail.svg';
import success from './images/success.svg';
import paymentAmount from './images/payment-amount.svg';
import "src/theme/main.css";
import "./style.css";

export type ReceiptDTO = {
  amount?: number;
  bank_slug?: string;
  bank_title?: string;
  created_at?: string;
  method?: "Cash" | "Draft" | "IBAN" | "Card" | "Online" | "Systemic";
  number?: string;
  reference_code?: string;
  status?: "Init" | "Pending" | "Accepted" | "Declined" | "Canceled";
  type?: "Deposit" | "Withdraw";
  updated_at?: string;
};

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const receiptNumber = urlParams.get("receiptNumber");

  const recieptRequest = fetch(`${process.env.API_BASE_URL}/receipts/${receiptNumber}`, { headers: { "Accept-Language": "fa-IR" }, })
    .then(response => {
      return response.json();
    })
    .then((data: ReceiptDTO) => {
      renderPage(data);
    });

  function renderPage(data: ReceiptDTO) {
    paymentStatusView(data);
    const TSTransaction = new TextStructure({ mountSelector: ".detail-container", props: { title: "شماره تراکنش", caption: data.number },});
    const TSTransactionDate = new TextStructure({ mountSelector: ".detail-container", props: { title: "تاریخ تراکنش", caption: getDate(data.updated_at) },});
    const TSTransactionTime = new TextStructure({ mountSelector: ".detail-container", props: { title: "ساعت تراکنش", caption: getTime(data.updated_at) },});
    const TSTransactionGateway = new TextStructure({ mountSelector: ".detail-container", props: { title: "درگاه تراکنش", caption: data.bank_title },});
    const TSTransactionAmount = new TextStructure({ mountSelector: ".detail-container", props: { title: "مبلغ تراکنش", caption: generateSegmentedNumber(data.amount), icon: paymentAmount, className:'amount' },});
  }

  function paymentStatusView(data) {
    let paymentHtml;
    if (data.status === "Accepted") {
      paymentHtml = `<div class='ods-payment-status status-success'>
                     <img src=${success} alt="success"/>
                     <span class='ods-payment-status__title'>تراکنش موفق</span>
                     <span class='ods-payment-status__caption'>مقدار شارژ:</span>
                     <span>${generateSegmentedNumber(data.amount)} تومان </span>
                     </div>`;
    }
    else{
      paymentHtml = `<div class='ods-payment-status status-fail'>
                     <img src=${fail} alt="fail"/>
                     <span class='ods-payment-status__title'>تراکنش ناموفق</span>
                     <span class='ods-payment-status__caption'>لطفا مجددا تلاش کنید.</span>
                     </div>`;
    }
    document.querySelector(".transaction-state").innerHTML = paymentHtml;
  }
});
