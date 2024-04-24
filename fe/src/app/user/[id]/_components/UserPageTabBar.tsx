export default function UserPageTabBar({
  onClickTap,
}: {
  onClickTap: Function;
}) {
  const navButtonCSS =
    "px-6 py-3 rounded-lg bg-appGrey2 hover:bg-appBlue1 whitespace-nowrap";

  return (
    <nav
      className="bg-appBlue4 m-4 p-4 rounded-2xl
      flex justify-between overflow-auto"
    >
      <div className="flex gap-4 pr-4">
        <button className={`${navButtonCSS}`} onClick={() => onClickTap(0)}>
          개요
        </button>
        <button className={`${navButtonCSS} `} onClick={() => onClickTap(1)}>
          연혁
        </button>
        <button className={`${navButtonCSS}`} onClick={() => onClickTap(2)}>
          레포
        </button>
        <button className={`${navButtonCSS}`} onClick={() => onClickTap(3)}>
          심층분석
        </button>
      </div>
      <button
        className={`${navButtonCSS} bg-gradient-to-r from-[#F5E5CA] to-[#41EAE5]`}
      >
        파도타기
      </button>
    </nav>
  );
}
