export const performSearch = async ({ view, geoJsonLayer, searchField, searchValue }) => {
    try {
        if (!geoJsonLayer || !geoJsonLayer.graphics) {
            console.error("Layer or graphics not ready.");
            throw new Error("Layer is not ready.");
        }

        console.log("Searching for:", searchValue, "in field:", searchField);
        const graphics = geoJsonLayer.graphics.items;

        if (!graphics || graphics.length === 0) {
            console.warn("No features available in the layer.");
            return { success: false, message: "No features available to search." };
        }

        const match = graphics.find((graphic) => {
            console.log("Checking graphic:", graphic.attributes);
            const attributeValue = graphic.attributes[searchField];
            return attributeValue && attributeValue.toString() === searchValue;
        });

        if (!match) {
            console.warn("No matching result found.");
            return { success: false, message: "No matching result found." };
        }

        console.log("Match found:", match);
        const geometry = match.geometry;

        await view.goTo(geometry.extent || geometry);
        view.popup.open({ features: [match], location: geometry.extent?.center || geometry });

        return { success: true };
    } catch (error) {
        console.error("Error during search:", error);
        return { success: false, message: "An error occurred during the search." };
    }
};
