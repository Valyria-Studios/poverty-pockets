export const performSearch = async ({
  view,
  geoJsonLayer,
  searchField,
  searchValue,
}) => {
  try {
    if (!geoJsonLayer) {
      console.error("Layer is not ready.");
      return { success: false, message: "Layer is not ready." };
    }

    console.log("Searching for:", searchValue, "in field:", searchField);

    // Create a query
    const query = geoJsonLayer.createQuery();
    query.where = `${searchField} = '${searchValue}'`; // Adjust if the field type is numeric
    query.returnGeometry = true;
    query.outFields = ["*"];

    // Perform the query
    const results = await geoJsonLayer.queryFeatures(query);

    if (!results.features.length) {
      console.warn("No matching result found.");
      return { success: false, message: "No matching result found." };
    }

    const match = results.features[0];

    console.log("Match found:", match);
    const geometry = match.geometry;

    await view.goTo(geometry.extent || geometry);
    view.popup.open({
      features: [match],
      location: geometry.extent?.center || geometry,
    });

    return { success: true };
  } catch (error) {
    console.error("Error during search:", error);
    return { success: false, message: "An error occurred during the search." };
  }
};
