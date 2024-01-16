import jsonFormat from "json-format";


export function jsonToHTML(json: any) {
    const text = jsonFormat(json, { type: 'space', size: 4 })
    return text.replace(/\n/g, "<br>").replace(/\s/g, "&nbsp;")
}