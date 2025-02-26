import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface URLQueryProps {
    queries: Record<string, any>;
    onURLChange: (values: Record<string, any>) => void;
}

const useURLQuery = ({ onURLChange, queries }: URLQueryProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const previousValuesRef = useRef<string | null>(null);

    const isValidValue = (value: any): boolean => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === "object" && value !== null) {
            return Object.values(value).some(isValidValue);
        }
        return value !== undefined && value !== null && value !== "";
    };

    const cleanObject = (obj: Record<string, any>): Record<string, any> => {
        const cleanedObject = Object.entries(obj).reduce(
            (acc, [key, value]) => {
                if (isValidValue(value)) {
                    acc[key] = value;
                }
                return acc;
            },
            {} as Record<string, any>
        );

        return Object.keys(cleanedObject).length > 0 ? cleanedObject : {};
    };

    // Getter useEffect - Reads query params and updates state
    useEffect(() => {
        const params: Record<string, any> = {};

        searchParams.forEach((value, key) => {
            try {
                const parsedValue = JSON.parse(value);
                params[key] = Array.isArray(parsedValue)
                    ? [...parsedValue]
                    : parsedValue;
            } catch {
                params[key] = value;
            }
        });

        onURLChange(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const setQueries = (values: Record<string, any>) => {
        const newSearchParams = new URLSearchParams();

        Object.keys(values).forEach((key) => {
            let value = values[key];

            if (
                typeof value === "object" &&
                value !== null &&
                !Array.isArray(value)
            ) {
                value = cleanObject(value);
            }

            if (isValidValue(value)) {
                newSearchParams.set(key, JSON.stringify(value));
            } else {
                newSearchParams.delete(key);
            }
        });

        const newUrl = `?${newSearchParams.toString()}`;
        if (previousValuesRef.current !== newUrl) {
            previousValuesRef.current = newUrl;
            router.push(newUrl, { scroll: false });
        }
    };

    // Setter useEffect - Updates URL when values change
    useEffect(() => {
        setQueries(queries);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queries]);
};

export default useURLQuery;
