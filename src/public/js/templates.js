const templateElements = document.querySelectorAll('.template');

const templates = {};

for (const template of templateElements) {
    const name = template.getAttribute('data-name');

    const routes = {};

    const add = (node) => {
        const route = node.getAttribute('data-route');

        if (route) {
            routes[route] = { reference: node, clean: node.cloneNode(true)};
        }
        
        if (node.children.length > 0) {
            for (const child of node.children) {
                add(child);
            }
        }
    };

    add(template);

    templates[name] = { template, routes };

    template.remove();
}

function instantiate(name, parent, routeAttributes={}, routeProperties={}) {
    const template = templates[name].template;

    if (typeof routeAttributes !== typeof {} || Array.isArray(routeAttributes)) {
        routeAttributes = {};
    }

    if (typeof routeProperties !== typeof {} || Array.isArray(routeProperties)) {
        routeProperties = {};
    }

    const attributeRoutes = Object.keys(routeAttributes);
    const propertyRoutes = Object.keys(routeProperties);

    const inject = (node) => {
        const route = node.getAttribute('data-route');

        if (attributeRoutes.includes(route)) {
            const attributes = Object.keys(routeAttributes[route]);

            for (const attribute of attributes) {
                node.setAttribute(attribute, routeAttributes[route][attribute]);
            }
        }

        if (propertyRoutes.includes(route)) {
            const properties = Object.keys(routeProperties[route]);

            for (const property of properties) {
                node[property] = routeProperties[route][property];
            }
        }

        for (const child of node.children) {
            inject(child);
        }
    }

    const copy = template.cloneNode(true);
    inject(copy);
    copy.classList.remove('template');

    if (!parent) {
        document.body.appendChild(copy);
    } else {
        parent.appendChild(copy);
    }

    return copy;
}