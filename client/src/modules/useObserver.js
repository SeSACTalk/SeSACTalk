import { useEffect } from "react";

export const useObserver = ({
    target, // 감지할 대상
    root = null, // 교차할 부모 요소 (dafault = document)
    rootMargin = "0px", // root 와 target이 감지하는 여백 거리
    threshold = 1.0, // 임계점으로 1.0이면 root내 target 이 100% 보여질때 callback 실행
    onIntersect, // target 감지시 실행할 callback
}) => {
    useEffect(() => {
        let observer;
        if (target && target.current) {
            observer = new IntersectionObserver(onIntersect, {
                root,
                rootMargin,
                threshold
            });
            observer.observe(target.current);
        }
        return () => observer && observer.disconnect();
    }, [target, rootMargin, threshold])
}