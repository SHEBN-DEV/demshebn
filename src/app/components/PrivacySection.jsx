import InputField from "./inputField";

const PrivacySection = ({ title, value, showForm, toggleForm, fields, errors, register, onSubmit }) => (
    <div className="bg-[#1C1D20] rounded-2xl p-6 space-y-2">
      {!showForm ? (
        <>
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-base text-gray-400">{value}</p>
          <button
            type="button"
            onClick={toggleForm}
            className="px-6 py-3 border hover:bg-[#ff29d7] border-white rounded-3xl text-sm font-medium text-white transition-colors duration-200 cursor-pointer"
          >
            CHANGE {title.toUpperCase()}
          </button>
        </>
      ) : (
        <>
          {fields.map((field) => (
            <InputField
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type || "text"}
              register={register}
              rules={field.rules}
              error={errors[field.name]}
            />
          ))}
          <button
            type="button"
            onClick={onSubmit}
            className="px-6 py-3 border hover:bg-[#ff29d7] border-white rounded-3xl text-sm font-medium text-white transition-colors duration-200 cursor-pointer"
          >
            SAVE {title.toUpperCase()}
          </button>
        </>
      )}
    </div>
  );

export default PrivacySection;   