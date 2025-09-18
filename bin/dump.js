function checkRouteCheckboxes(routeList) {
  const routes = routeList || [];

  let checkedCount = 0;
  let foundCount = 0;
  routes.forEach(route => {
    //assuming that att -> data-route-info
    const checkbox = document.querySelector(`input.routeChex[data-route-info="${route}"]`);
    if (checkbox) {
      foundCount++;
      if (!checkbox.checked) {
        checkbox.checked = true;
        checkedCount++;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  });

  console.log(`Found ${foundCount} matching checkboxes`);
  console.log(`Checked ${checkedCount} new checkboxes`);
  console.log(`${foundCount - checkedCount} were already checked`);

  return {
    found: foundCount,
    newlyChecked: checkedCount,
    alreadyChecked: foundCount - checkedCount
  };
}
