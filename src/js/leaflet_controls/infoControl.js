import { Control, DomUtil } from "leaflet";

Control.InfoControl = Control.extend({
    text: "asdsa",
    onAdd(map) {
        let htmlElement = DomUtil.create("div", "leaflet-ui-info");
        htmlElement.innerHTML = this.text;
        return htmlElement;
    },
    onRemove(map) {},
});
