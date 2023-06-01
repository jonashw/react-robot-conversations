type AvatarSize = "sm" | "md" | "lg" | "xl";
const fontSizes: { [size: string]: string } = {
  sm: "1em",
  md: "2em",
  lg: "5em",
  xl: "8em",
};

export default ({
  emoji,
  name,
  size,
}: {
  emoji: string | undefined;
  name?: string;
  size?: AvatarSize;
}) => (
  <div>
    <div>
      <div style={{ fontSize: fontSizes[size || "md"] }}>{emoji || "👤"}</div>
      {!!name && <h5>{name}</h5>}
    </div>
  </div>
);
