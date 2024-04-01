import "./TextArea.css";

interface ITextArea {
  entry?: boolean;
  output?: boolean;
  handleChange: (e: any) => void;
  value: string;
}

const TextArea = ({
  entry = false,
  output = false,
  handleChange,
  value,
}: ITextArea) => {
  return (
    <div className="text-area">
      <textarea
        id="translate-box"
        name="translate"
        value={value}
        onChange={handleChange}
        rows={6}
        disabled={output}
      />
      {entry && <span>{value?.length}/500</span>}
    </div>
  );
};

export default TextArea;
