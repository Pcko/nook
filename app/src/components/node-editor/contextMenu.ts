import styled from "styled-components";
import { Presets } from "rete-react-plugin";

const { Menu, Common, Search, Item, Subitems } = Presets.contextMenu;

const colors = {
  primary: "var(--primary)",
  secondary: "var(--secondary)",
  primaryHover: "var(--primary-hover)",
  websiteBg: "var(--website-bg)",
  uiBg: "var(--ui-bg)",
  text: "var(--text)",
  hover: "var(--ui-bg-selected)",
  active: "var(--ui-button-hover)",
  border: "var(--ui-border)",
  separator: "var(--ui-subtle)",
  inputBg: "var(--ui-border-selected)",
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