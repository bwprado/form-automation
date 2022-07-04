import wixSite from "wix-site";
import { prepareFormData } from "public/form-automation/utils";

console.time("mainpagetimer");

/**
 * @function handleSubmit
 * @description This function is triggered on form submission.
 * @param {object} e - Event object
 * @returns {Array|boolean} Form data.
 */
const handleSubmit = (e) => {
  const formData = prepareFormData(e);
  return formData;
};

$w.onReady(function () {
  // Prefetch
  let response = wixSite.prefetchPageResources({
    pages: ["/vision", "/what-we-believe", "/starting-point"],
  });

  if (response.errors) {
    // handle errors
  }
  /**
   * @method onWixFormSubmit
   * @description Handles all form submissions at once.
   */
  $w(
    "#wixFormOnline, #wixFormEast, #wixFormWest, #wixFormChinese, #wixFormLation"
  ).onWixFormSubmit(handleSubmit);
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

//collapse form after submission
export function wixFormOnline_wixFormSubmitted() {
  //$w('#textForm').text = "Thank you, we look forward to seeing you!";
  $w("#textSelectACampus").scrollTo();
  $w("#multiStateBox1").collapse();
  //$w('#html1').expand();
  $w("#imageThankYou").expand();
}

export function wixFormEast_wixFormSubmitted() {
  //$w('#textForm').text = "Thank you, we look forward to seeing you!";
  $w("#textSelectACampus").scrollTo();
  $w("#multiStateBox1").collapse();
  //$w('#html1').expand();
  $w("#imageThankYou").expand();
}

export function wixFormWest_wixFormSubmitted() {
  //$w('#textForm').text = "Thank you, we look forward to seeing you!";
  $w("#textSelectACampus").scrollTo();
  $w("#multiStateBox1").collapse();
  //$w('#html1').expand();
  $w("#imageThankYou").expand();
}

export function wixFormLatino_wixFormSubmitted() {
  //$w('#textForm').text = "Thank you, we look forward to seeing you!";
  $w("#textSelectACampus").scrollTo();
  $w("#multiStateBox1").collapse();
  //$w('#html1').expand();
  $w("#imageThankYou").expand();
}

export function wixFormChinese_wixFormSubmitted() {
  //$w('#textForm').text = "Thank you, we look forward to seeing you!";
  $w("#textSelectACampus").scrollTo();
  $w("#multiStateBox1").collapse();
  //$w('#html1').expand();
  $w("#imageThankYou").expand();
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
  //$w("#html1").collapse();
  $w("#imageThankYou").collapse();
}

export function buttonEast_click(event) {
  $w("#multiStateBox1").expand();
  $w("#multiStateBox1").changeState("stateEast");
  $w("#buttonOnline").enable();
  $w("#buttonEast").disable();
  $w("#buttonWest").enable();
  $w("#buttonLatino").enable();
  $w("#buttonChinese").enable();
  //$w("#html1").collapse();
  //$w("#stateEast").expand();
  //$w("#stateWest").collapse();
  $w("#imageThankYou").collapse();
}

export function buttonWest_click(event) {
  $w("#multiStateBox1").expand();
  $w("#multiStateBox1").changeState("stateWest");
  $w("#buttonOnline").enable();
  $w("#buttonEast").enable();
  $w("#buttonWest").disable();
  $w("#buttonLatino").enable();
  $w("#buttonChinese").enable();
  //$w("#html1").collapse();
  //$w("#stateEast").collapse();
  //$w("#stateWest").expand();
  $w("#imageThankYou").collapse();
}

export function buttonLatino_click(event) {
  $w("#multiStateBox1").expand();
  $w("#multiStateBox1").changeState("stateLatino");
  $w("#buttonOnline").enable();
  $w("#buttonEast").enable();
  $w("#buttonWest").enable();
  $w("#buttonLatino").disable();
  $w("#buttonChinese").enable();
  //$w("#html1").collapse();
  $w("#imageThankYou").collapse();
}

export function buttonChinese_click(event) {
  $w("#multiStateBox1").expand();
  $w("#multiStateBox1").changeState("stateChinese");
  $w("#buttonOnline").enable();
  $w("#buttonEast").enable();
  $w("#buttonWest").enable();
  $w("#buttonLatino").enable();
  $w("#buttonChinese").disable();
  //$w("#html1").collapse();
  $w("#imageThankYou").collapse();
}
