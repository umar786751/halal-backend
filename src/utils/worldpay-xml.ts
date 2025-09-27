import { create } from 'xmlbuilder2';

interface TransactionSetupInput {
  applicationId: string;
  accountId: string;
  accountToken: string;
  acceptorId: string;
  amount: number;
  orderId: number;
  returnUrl: string;
}

export function generateTransactionSetupXml(input: TransactionSetupInput): string {
  const {
    applicationId,
    accountId,
    accountToken,
    acceptorId,
    amount,
    orderId,
    returnUrl,
  } = input;

  const doc = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('TransactionSetup', { xmlns: 'https://transaction.elementexpress.com' })
    .ele('Application')
      .ele('ApplicationID').txt(applicationId).up()
      .ele('ApplicationName').txt('POS Checkout').up()
      .ele('ApplicationVersion').txt('1.0').up()
    .up()
    .ele('Credentials')
      .ele('AccountID').txt(accountId).up()
      .ele('AccountToken').txt(accountToken).up()
      .ele('AcceptorID').txt(acceptorId).up()
    .up()
    .ele('Transaction')
      .ele('TransactionAmount').txt(amount.toFixed(2)).up()
      .ele('MarketCode').txt('3').up()
      .ele('ReferenceNumber').txt(orderId.toString()).up()
      .ele('TicketNumber').txt(orderId.toString()).up()
      .ele('PartialApprovedFlag').txt('0').up()
      .ele('DuplicateCheckDisableFlag').txt('1').up()
    .up()
    .ele('Terminal')
      .ele('CardholderPresentCode').txt('7').up()
      .ele('CardInputCode').txt('4').up()
      .ele('CardPresentCode').txt('3').up()
      .ele('CVVPresenceCode').txt('2').up()
      .ele('MotoECICode').txt('7').up()
      .ele('TerminalCapabilityCode').txt('5').up()
      .ele('TerminalEnvironmentCode').txt('6').up()
      .ele('TerminalType').txt('2').up()
      .ele('TerminalID').txt('POS01').up()
    .up()
    .ele('TransactionSetup')
      .ele('TransactionSetupMethod').txt('1').up()
      .ele('DeviceInputCode').txt('0').up()
      .ele('Embedded').txt('0').up()
      .ele('EnableCaptcha').txt('0').up()
      .ele('CVVRequired').txt('1').up()
      .ele('AutoReturn').txt('1').up()
      .ele('ReturnURL').txt(returnUrl).up()
      .ele('ProcessTransactionTitle').txt('Pay Now').up()
    .up()
  .end({ prettyPrint: true });

  return doc;
}
