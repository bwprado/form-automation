import wixData from 'wix-data'

$w.onReady(() => {
  //buildCampus();
  populateLocation()
  //filterDayDropdown();
  //filterCampusDropdown();

  $w('#dropdownCampus, #dropdownDay').onChange(() => {
    search()
  })

  $w('#datasetLearning')
    .setFilter(wixData.filter().ne('isHidden', true))
    .then(count2)

  $w('#resetBtn').onClick(() => {
    $w('#loading').show()
    $w('#datasetLearning')
      .setFilter(wixData.filter().ne('isHidden', true))
      .then(count2)
    $w('#dropdownDay, #dropdownCampus').selectedIndex = undefined
  })

  $w('#repeater1').onItemReady(($w, itemData, index) => {
    let buttonUrl = itemData.actionButtonUrl
    let buttonLabel = itemData.actionButtonLabel
    $w('#buttonAction').link = buttonUrl
    //$w("#buttonAction").target = "_blank";
    /*
            if (itemData.classPage) {
                $w("#buttonWatch").expand();
            } else {
                $w("#buttonWatch").collapse();
            }
        */
    // show/hide action button
    itemData.actionButtonUrl
      ? $w('#buttonAction').expand()
      : $w('#buttonAction').collapse()

    // action button label defaults to Register, but can be overwriiten in the Collection
    itemData.actionButtonLabel
      ? ($w('#buttonAction').label = buttonLabel)
      : ($w('#buttonAction').label = 'Register')
  })
})

// THIS CODE DOES NOT WORK - WC
// Attempt at coding the Current Classes button
/*
$w("#datasetSchedule").onReady(() => {

    let seasonTag = $w("#datasetSchedule").getCurrentItem();
    let springUrl = "https://docs.google.com/document/d/1QmhTbI1Jde7uy5Tdf_ksidwQMWxHcv0gFvQsBsf9D0Q/edit?usp=sharing";
    let summerUrl = "https://docs.google.com/document/d/1B3hBx21WChdWmimk86zCcotRMjgoHKeLfDO6bNQok9I/edit?usp=sharing";
    let fallUrl = "https://docs.google.com/document/d/1A2WiYorph7HjgiH7bAIC65Qn3M-CjtuVSOlVrTNQTP0/edit?usp=sharing";
    let winterUrl = "https://docs.google.com/document/d/1BaTEjXu2O8M7Cz_8sOt4SIc552KtDWgpOmKaPHEwElQ/edit?usp=sharing";
    if (seasonTag === "Spring") {
        $w("#buttonClassMapEast2").link = springUrl;
    }
    if (seasonTag === "Summer") {
        $w("#buttonClassMapEast2").link = summerUrl;
    }
    if (seasonTag === "Fall") {
        $w("#buttonClassMapEast2").link = fallUrl;
    }
    if (seasonTag === "Winter") {
        $w("#buttonClassMapEast2").link = winterUrl;
    }
})
*/

/*
function filterDayDropdown() {

    $w("#datasetLearning").onReady(() => {

        $w("#dropdownDay").onChange(() => {
            console.log($w("#dropdownDay").value)

            if ($w("#dropdownDay").value === "All") {

                $w("#datasetLearning").setFilter(wixData.filter().ne("isHidden", true))
                    .then(count)

            } else {

                $w("#datasetLearning").setFilter(wixData.filter().contains("day", $w("#dropdownDay").value).ne("isHidden", true))
                    .then(count)

            }

        })

    })
}
*/

function populateLocation() {
  wixData
    .query('LearningCommunity')
    .ne('isHidden', true)
    .limit(1000)
    .ascending('day')
    .distinct('day')
    .then((results) => {
      let distinctList = buildOptions2(results.items)
      // Add "All" to the existing list
      distinctList.unshift({ value: 'All', label: 'All' })
      // build the unique elemnt list
      $w('#dropdownDay').options = distinctList
    })
}

function buildOptions2(items) {
  return items.map((curr) => {
    // Use the map method to build the options list in the format {label:uniqueTitle, value:uniqueTitle}
    return { label: curr, value: curr }
  })
}

function count() {
  $w('#datasetLearning').onReady(() => {
    let total = $w('#datasetLearning').getTotalCount()

    if (total > 1) {
      $w('#totalResultsText').text = `${total} results found`
      $w('#totalResultsText, #resetBtn').show()
    } else if (total === 1) {
      $w('#totalResultsText').text = `${total} result found`
      $w('#totalResultsText, #resetBtn').show()
    } else {
      $w('#totalResultsText').text = `${total} results found`
      $w('#totalResultsText, #resetBtn').show()
    }

    $w('#loading').hide()
  })
}

function count2() {
  $w('#datasetLearning').onReady(() => {
    let total = $w('#datasetLearning').getTotalCount()

    if (total > 1) {
      $w('#totalResultsText').text = `${total} results found`
      $w('#totalResultsText').show()
    } else if (total === 1) {
      $w('#totalResultsText').text = `${total} result found`
      $w('#totalResultsText').show()
    } else {
      $w('#totalResultsText').text = `${total} results found`
      $w('#totalResultsText').show()
    }

    $w('#loading').hide()
    $w('#resetBtn').hide()
  })
}

/*
async function buildCampus() {

    // get non-duplicate provider id from the database
    let resCampus = await wixData.query('LearningCommunity').ne("isHidden", true).limit(999).distinct("campus");
    console.log({ resCampus });

    let res = await wixData.query("Campuses").hasSome("_id", resCampus.items).limit(999).ascending("title").find();
    console.log({ res })
    let options = [{
            label: "All",
            value: "all"
        },
        ...res.items.map(el => ({ label: el.title, value: el._id }))
    ]
    console.log({ options })

    $w("#dropdownCampus").options = options

}

function filterCampusDropdown() {

    $w("#dropdownCampus").onChange(() => {

        $w("#loading").show();

        console.log($w("#dropdownCampus").value)

        $w("#datasetLearning").setFilter(wixData.filter().hasSome("campus", $w("#dropdownCampus").value))
            .then(count)

        //$w("#datasetLearning").setFilter(wixData.filter().hasSome("_id", $w("#dropdownCampus").value))
        //.then(count)

    })
}
*/

function search() {
  $w('#loading').show()
  let filter = wixData.filter().ne('isHidden', true)
  let campus = $w('#dropdownCampus').value
  let day = $w('#dropdownDay').value

  if (campus && campus !== '') {
    filter = filter.hasSome('campus', campus)
  }
  if (day && day !== 'All') {
    filter = filter.eq('day', day) //town is my field key
  }

  $w('#datasetLearning').setFilter(filter).then(count)

  console.log(filter)
}
