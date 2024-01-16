import jsonFormat from "json-format";


export function jsonToHTML(json: any) {
    const text = jsonFormat(json)
    return text.replace(/\n/g, "<br>").replace(/\s/g, "&nbsp;")
}