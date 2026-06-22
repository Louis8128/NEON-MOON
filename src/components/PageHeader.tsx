type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

// Shared heading block used at the top of major pages.
// 复用页面标题组件，避免每个页面重复写标题结构。
export default function PageHeader({
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="mb-10">
      <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-slate-400">
        {eyebrow}
      </p>

      <h1 className="mb-6 text-4xl font-bold tracking-tight">{title}</h1>

      <p className="max-w-2xl text-lg leading-8 text-slate-300">
        {description}
      </p>
    </div>
  );
}
