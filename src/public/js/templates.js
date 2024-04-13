const templateElements = document.querySelectorAll('.template');

const templates = {};

// Loop through all elements that have the 'template' class
for (const template of templateElements) {
    const name = template.getAttribute('data-name');

    // Set templates.{name} to the template
    templates[name] = { template };

    // Remove the template from the document
    template.remove();
}

/**
 * Creates a new instance of a template
 * @param {*} name Name of the template to instantiate
 * @param {*} parent The object to append the instance to
 * @param {*} routeAttributes HTML attributes to modify (such as style, id, name, etc.) at a given route
 * @param {*} routeProperties JS properties to modify (such as innerHTML, textContent, etc.) at a given route
 * @returns The template object
 */
function instantiate(name, parent, routeAttributes={}, routeProperties={}) {
    const template = templates[name].template;

    // If for whatever reason the parameters aren't of type 'object,' make them
    // an empty object
    if (typeof routeAttributes !== typeof {} || Array.isArray(routeAttributes)) {
        routeAttributes = {};
    }

    if (typeof routeProperties !== typeof {} || Array.isArray(routeProperties)) {
        routeProperties = {};
    }

    // Get all the keys in both
    // They should be formatted like { flag: { src: `/src/to/flag.png`, name: `country-name` } }
    // Where 'flag' is the name of the route, and src and name are attributes to modify
    // In the example above, attributeRoutes = [ 'flag' ]
    const attributeRoutes = Object.keys(routeAttributes);
    const propertyRoutes = Object.keys(routeProperties);

    /**
     * Recursively travels through each child in a template to check if any child's route matches a
     * route specified in either attributeRoutes or propertyRoutes. If it does, it then injects
     * the given information into that route's element before rendering
     * @param {*} node The current node
     */
    const inject = (node) => {
        // Get the route on the object
        const route = node.getAttribute('data-route');

        // If the route at the node is included in the list of attribute routes
        if (attributeRoutes.includes(route)) {
            // Get all attributes to modify (such as src, id, name) 
            const attributes = Object.keys(routeAttributes[route]);

            // Set the attributes
            for (const attribute of attributes) {
                node.setAttribute(attribute, routeAttributes[route][attribute]);
            }
        }

        // Same thing as above, but with properties
        if (propertyRoutes.includes(route)) {
            // Get all properties (like innerHTML & textContent)
            const properties = Object.keys(routeProperties[route]);

            // Assign them here
            for (const property of properties) {
                node[property] = routeProperties[route][property];
            }
        }

        for (const child of node.children) {
            inject(child);
        }
    }

    // Clone the original node the template is derived from, inject the changes, and remove the
    // template class
    const copy = template.cloneNode(true);
    inject(copy);
    copy.classList.remove('template');

    // If no parent is specified, just append it to the document's body
    if (!parent) {
        document.body.appendChild(copy);
    } else {
        parent.appendChild(copy);
    }

    return copy;
}