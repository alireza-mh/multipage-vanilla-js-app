import semiUniq from "src/utils/semiUniq";
import "./style.css";

/* make general interface for all components */
interface ITextStructure {
  props: ITextStructureProps;
  name?: string;
  mountSelector: string;
  render?: () => void;
}
type ITextStructureProps = { title: string; caption: string | number; icon?: string, className?: string};

export default class TextStructure implements ITextStructure {
  mountSelector: string;
  uniqComponentName: string;
  props: ITextStructureProps;
  mountElem: any;
  constructor({ mountSelector, name, props }: ITextStructure) {
    this.mountSelector = mountSelector;
    this.uniqComponentName = name || `TextStructure-${semiUniq()}`;
    this.props = props;
    this.render();
  }

  render() {
    const props = this.props;
    const iconElement = props.icon ? `<div class="text-structure__icon"><img src="${props.icon}" alt="${props.title}"/></div>` : '';
    this.mountElem = document.querySelector(this.mountSelector);
    /* TODO find a way to remove extra DOM element (extra div)*/
    const dummyElement = document.createElement("div");
    dummyElement.innerHTML = `<div id='${this.uniqComponentName}' class="text-structure ${props.className ? props.className : ''}">
    ${props.title ? `<div class="text-structure__title">${iconElement}${props.title}</div>` : ""}
    ${props.caption ? `<div class="text-structure__caption">${props.caption}</div>` : ""}
   </div>`;
    this.mountElem.appendChild(dummyElement);
  }
}
