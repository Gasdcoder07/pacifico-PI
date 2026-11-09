import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    images: {
        qualities: [25, 50, 75, 80, 100],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.pravatar.cc",
            },
        ],
    },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);