import { models } from "../../modules/llm";

type Props = {
  defaultValues?: {
    name: string;
    modelType: string;
    systemPrompt: string;
  };
};

export const AgentFormFields = ({ defaultValues }: Props) => {
  return (
    <>
      <label htmlFor="name">
        Name
        <input name="name" type="text" defaultValue={defaultValues?.name} />
      </label>

      <label htmlFor="modelType">
        modelType
        <select name="modelType" defaultValue={defaultValues?.modelType}>
          {models.map(({ key, name }) => (
            <option key={key} value={key}>
              {name}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="systemPrompt">
        System Prompt
        <textarea
          name="systemPrompt"
          rows={5}
          defaultValue={defaultValues?.systemPrompt}
        />
      </label>
    </>
  );
};
