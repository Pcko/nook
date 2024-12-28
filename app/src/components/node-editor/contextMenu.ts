import styled from "styled-components";
import { Presets } from "rete-react-plugin";

const { Menu, Common, Search, Item, Subitems } = Presets.contextMenu;

const colors = {
  primary: "#6B439B",
  secondary: "#8869AD",
  primaryHover: "#5A3382",
  websiteBg: "#202020",
  uiBg: "#2B2B2B",
  text: "#E0E0E0",
  hover: "#3A3A3A",
  active: "#4A4A4A",
  border: "#3D3D3D",
  separator: "#5A5A5A",
  inputBg: "#1C1C1C",
};

const CustomMenu = styled(Menu)`
  width: 320px;
  background: linear-gradient(180deg, ${colors.uiBg} 0%, ${colors.websiteBg} 100%);
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.8);
  color: ${colors.text};
  font-family: Arial, sans-serif;
  border: 1px solid ${colors.border};
  overflow: hidden;
`;

const CustomItem = styled(Item)`
  padding: 12px 16px;
  background: ${colors.uiBg};
  color: ${colors.text};
  font-size: 14px;
  cursor: pointer;
  border-bottom: 1px solid ${colors.separator};
  transition: background 0.2s ease;

  &:hover {
    background: ${colors.hover};
  }

  &:last-child {
    border-bottom: none;
  }

  &.active {
    background: ${colors.active};
    color: ${colors.primary};
  }
`;

const CustomCommon = styled(Common)`
  font-size: 12px;
  padding: 8px 16px;
  background: ${colors.uiBg};
  color: ${colors.text};
  border-bottom: 1px solid ${colors.separator};
`;

const CustomSearch = styled(Search)`
  width: 100%;
  padding: 10px 14px;
  margin-bottom: 8px;
  background: ${colors.inputBg};
  border: 1px solid ${colors.border};
  border-radius: 4px;
  color: ${colors.text};
  font-size: 14px;

  &::placeholder {
    color: #888;
  }

  &:focus {
    border-color: ${colors.primary};
    outline: none;
  }
`;

const CustomSubitems = styled(Subitems)`
  padding: 8px 16px;
  background: ${colors.uiBg};
  color: ${colors.text};
  border-top: 1px solid ${colors.separator};
`;

const Separator = styled.div`
  height: 1px;
  background-color: ${colors.separator};
  margin: 8px 0;
`;

const Preset = Presets.contextMenu.setup({
  customize: {
    main: () => CustomMenu,
    item: () => CustomItem,
    common: () => CustomCommon,
    search: () => CustomSearch,
    subitems: () => CustomSubitems,
    separator: () => Separator,
  },
});

export default Preset;
