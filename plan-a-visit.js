import wixSite from "wix-site";
import { formAutomation } from "backend/form-automation/init";

console.time("mainpagetimer");

/**
 * @function thankYouMessage
 * @description This function thanks the visitor for the form input
 */
const thankYouMessage = () => {
  $w("#textSelectACampus").scrollTo();
  $w("#multiStateBox1").collapse();
  $w("#lottieThankYou").expand();
  $w("#lottieThankYou").play();
};

/**
 * @function handleSubmission
 * @description This function is triggered on form submission.
 * @param {object} e - Event object
 */
const handleSubmission = (e) => {
  formAutomation(e);
  thankYouMessage();
};

$w.onReady(function () {
  // Prefetch
  let response = wixSite.prefetchPageResources({
    pages: ["/vision", "/what-we-believe", "/starting-point"]
  });

  if (response.errors) {
    // handle errors
  }
  /**
   * @method onWixFormSubmit
   * @description Handles all form submissions at once.
   */
  $w(
    "#wixFormOnline, #wixFormEast, #wixFormWest, #wixFormChinese, #wixFormLatino"
  ).onWixFormSubmitted(handleSubmission);

  console.timeEnd("mainpagetimer");
});

//expand captcha after input
export function inputFirstNameOnline_input(event) {
  $w("#captchaOnline").expand();
}

export function inputFirstNameEast_input(event) {
  $w("#captchaEast").expand();
}

export function inputFirstNameWest_input(event) {
  $w("#captchaWest").expand();
}

export function inputFirstNameLatino_input(event) {
  $w("#captchaLatino").expand();
}

export function inputFullNameChinese_input(event) {
  $w("#captchaChinese").expand();
}

//Plan A Visit tabs/buttons
export function buttonOnline_click(event) {
  $w("#multiStateBox1").expand();
  $w("#multiStateBox1").changeState("stateOnline");
  $w("#buttonOnline").disable();
  $w("#buttonEast").enable();
  $w("#buttonWest").enable();
  $w("#buttonLatino").enable();
  $w("#buttonChinese").enable();
  $w("#html1Select").collapse();
  $w("#lottieThankYou").collapse();
  //$w("#html2ThankYou").collapse();
  //$w("#imageThankYou").collapse();
}

export function buttonEast_click(event) {
  $w("#multiStateBox1").expand();
  $w("#multiStateBox1").changeState("stateEast");
  $w("#buttonOnline").enable();
  $w("#buttonEast").disable();
  $w("#buttonWest").enable();
  $w("#buttonLatino").enable();
  $w("#buttonChinese").enable();
  $w("#html1Select").collapse();
  //$w("#html2ThankYou").collapse();
  $w("#lottieThankYou").collapse();
  //$w("#stateEast").expand();
  //$w("#stateWest").collapse();
  //$w("#imageThankYou").collapse();
}

export function buttonWest_click(event) {
  $w("#multiStateBox1").expand();
  $w("#multiStateBox1").changeState("stateWest");
  $w("#buttonOnline").enable();
  $w("#buttonEast").enable();
  $w("#buttonWest").disable();
  $w("#buttonLatino").enable();
  $w("#buttonChinese").enable();
  $w("#html1Select").collapse();
  //$w("#html2ThankYou").collapse();
  $w("#lottieThankYou").collapse();
  //$w("#stateEast").collapse();
  //$w("#stateWest").expand();
  //$w("#imageThankYou").collapse();
}

export function buttonLatino_click(event) {
  $w("#multiStateBox1").expand();
  $w("#multiStateBox1").changeState("stateLatino");
  $w("#buttonOnline").enable();
  $w("#buttonEast").enable();
  $w("#buttonWest").enable();
  $w("#buttonLatino").disable();
  $w("#buttonChinese").enable();
  $w("#html1Select").collapse();
  $w("#lottieThankYou").collapse();
  //$w("#html2ThankYou").collapse();
  //$w("#imageThankYou").collapse();
}

export function buttonChinese_click(event) {
  $w("#multiStateBox1").expand();
  $w("#multiStateBox1").changeState("stateChinese");
  $w("#buttonOnline").enable();
  $w("#buttonEast").enable();
  $w("#buttonWest").enable();
  $w("#buttonLatino").enable();
  $w("#buttonChinese").disable();
  $w("#html1Select").collapse();
  $w("#lottieThankYou").collapse();
  //$w("#html2ThankYou").collapse();
  //$w("#imageThankYou").collapse();
}
