-- CreateTable
CREATE TABLE `Player` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `displayName` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tournament` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `playerCount` INTEGER UNSIGNED NOT NULL,
    `status` ENUM('DRAFT', 'REGISTRATION', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Tournament_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TournamentPlayer` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `tournamentId` INTEGER UNSIGNED NOT NULL,
    `playerId` INTEGER UNSIGNED NOT NULL,
    `registeredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TournamentPlayer_playerId_idx`(`playerId`),
    UNIQUE INDEX `TournamentPlayer_tournamentId_playerId_key`(`tournamentId`, `playerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Day` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `tournamentId` INTEGER UNSIGNED NOT NULL,
    `dayNumber` SMALLINT UNSIGNED NOT NULL,
    `date` DATE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Day_tournamentId_dayNumber_key`(`tournamentId`, `dayNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Round` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `tournamentId` INTEGER UNSIGNED NOT NULL,
    `roundNumber` SMALLINT UNSIGNED NOT NULL,
    `type` ENUM('QUALIFIER', 'FINAL') NOT NULL DEFAULT 'QUALIFIER',
    `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `startedAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Round_tournamentId_status_idx`(`tournamentId`, `status`),
    UNIQUE INDEX `Round_tournamentId_roundNumber_key`(`tournamentId`, `roundNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lobby` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `roundId` INTEGER UNSIGNED NOT NULL,
    `lobbyNumber` SMALLINT UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Lobby_roundId_lobbyNumber_key`(`roundId`, `lobbyNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LobbyPlayer` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `lobbyId` INTEGER UNSIGNED NOT NULL,
    `playerId` INTEGER UNSIGNED NOT NULL,
    `qualifiedForNextRound` BOOLEAN NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LobbyPlayer_playerId_qualifiedForNextRound_idx`(`playerId`, `qualifiedForNextRound`),
    UNIQUE INDEX `LobbyPlayer_lobbyId_playerId_key`(`lobbyId`, `playerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `matches` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `lobbyId` INTEGER UNSIGNED NOT NULL,
    `dayId` INTEGER UNSIGNED NOT NULL,
    `gameNumber` SMALLINT UNSIGNED NOT NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `startedAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `matches_dayId_startedAt_idx`(`dayId`, `startedAt`),
    INDEX `matches_status_idx`(`status`),
    UNIQUE INDEX `matches_lobbyId_gameNumber_key`(`lobbyId`, `gameNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MatchResult` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `matchId` INTEGER UNSIGNED NOT NULL,
    `playerId` INTEGER UNSIGNED NOT NULL,
    `placement` TINYINT UNSIGNED NOT NULL,
    `points` TINYINT UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `MatchResult_playerId_matchId_idx`(`playerId`, `matchId`),
    UNIQUE INDEX `MatchResult_matchId_playerId_key`(`matchId`, `playerId`),
    UNIQUE INDEX `MatchResult_matchId_placement_key`(`matchId`, `placement`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TournamentPlayer` ADD CONSTRAINT `TournamentPlayer_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `Tournament`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TournamentPlayer` ADD CONSTRAINT `TournamentPlayer_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Day` ADD CONSTRAINT `Day_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `Tournament`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Round` ADD CONSTRAINT `Round_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `Tournament`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lobby` ADD CONSTRAINT `Lobby_roundId_fkey` FOREIGN KEY (`roundId`) REFERENCES `Round`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LobbyPlayer` ADD CONSTRAINT `LobbyPlayer_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LobbyPlayer` ADD CONSTRAINT `LobbyPlayer_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_dayId_fkey` FOREIGN KEY (`dayId`) REFERENCES `Day`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MatchResult` ADD CONSTRAINT `MatchResult_matchId_fkey` FOREIGN KEY (`matchId`) REFERENCES `matches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MatchResult` ADD CONSTRAINT `MatchResult_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
