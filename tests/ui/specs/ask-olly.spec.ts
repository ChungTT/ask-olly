import { test } from '@playwright/test';
import  {LoginPage}  from '../pages/login.page';
import { AskOllyPage } from '../pages/ask-olly.page';

let ask: AskOllyPage;
test.describe('Ask Olly', () => {
  test.describe.configure({ timeout: 120_000 })
  test.beforeEach(async ({ page }) => {
    await new LoginPage(page).login();
    await new AskOllyPage(page).goto();
  });

  test('TC-01 Verify Ask Olly screen', async ({ page }) => {
    const ask = new AskOllyPage(page);
    await ask.verifyInitialScreen('Hanh Le Test', 60_000);
  });

  test('TC-02 Verify sending question with selecting client', async ({ page }) => {
    const ask = new AskOllyPage(page);
    let question = 'What is the workout compliance trend over the last 2 weeks?';
    question = await ask.sendQuestion(question, 'Client Test');
    await ask.verifyQuestionAndResponse(question);
  });

  test('TC-03 Verify sending question without selecting client', async ({ page }) => {
    const ask = new AskOllyPage(page);
    const question = 'How many workouts were missed in the last 7 days?';
    await ask.sendQuestion(question);
    await ask.verifyQuestionAndResponse(question);
  });

  test('TC-04 Verify sending Example card without selecting client', async ({ page }) => {
    const ask = new AskOllyPage(page);
    const exampleText = await ask.sendExampleCard(0);
    await ask.verifyQuestionAndResponse(exampleText);
  });
  test('TC-05 Verify sending Example card selecting client', async ({ page }) => {
    const ask = new AskOllyPage(page);
    const exampleText = await ask.sendExampleCard(0, 'Client Test');
    await ask.verifyQuestionAndResponse(exampleText, 'Client Test');
  });

  test('TC-06 Verify creating a new chat (OK)', async ({ page }) => {
    const ask = new AskOllyPage(page);

    const question = `what were the top 3 missed workout names?`;
    await ask.sendQuestion(question);
    await ask.verifyQuestionAndResponse(question);

    await ask.clickNewChatAndConfirmOk();
    await ask.verifyChatReset(question);
  });

  test('TC-07 Verify creating a new chat (Cancel)', async ({ page }) => {
    const ask = new AskOllyPage(page);

    const question = `How does that compare to the previous 5 days?`;
    await ask.sendQuestion(question);
    await ask.verifyQuestionAndResponse(question);

    await ask.clickNewChatAndCancel();
    await ask.verifyChatNotReset(question);
  });
  test('TC-08 Verify send disabled when input is empty only space (Intentional Fail) - Demonstrate failing report on Ask Olly', async ({ page }) => {
    const ask = new AskOllyPage(page);
    const question = '   ';
    await ask.sendQuestion(question);
    //Intentional FAIL: Send button "should be enabled" even when input is empty
    // it should be disabled is correct, but let set it to enabled to demonstrate failing report
    await ask.verifySendButtonEnabled();
  }); 
});
