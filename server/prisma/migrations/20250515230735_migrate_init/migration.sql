-- CreateTable
CREATE TABLE "Bin" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "is_full" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Bin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "sold" BOOLEAN NOT NULL DEFAULT false,
    "web_url" VARCHAR(256) DEFAULT 'https://poshmark.com',
    "bin_id" INTEGER,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_bin_id_fkey" FOREIGN KEY ("bin_id") REFERENCES "Bin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
