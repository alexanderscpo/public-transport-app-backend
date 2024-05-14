CREATE TABLE `parada` (
	`id` text(10) PRIMARY KEY NOT NULL,
	`nombre` text(50) NOT NULL,
	`direccion` text(100) NOT NULL,
	`x` real NOT NULL,
	`y` real NOT NULL,
	`provincia_id` integer NOT NULL,
	FOREIGN KEY (`provincia_id`) REFERENCES `provincia`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `provincia` (
	`id` integer PRIMARY KEY NOT NULL,
	`nombre` text(50) NOT NULL,
	`abreviatura` text(5) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ruta` (
	`id` integer PRIMARY KEY NOT NULL,
	`nombre` text(10) NOT NULL,
	`origen` text(40) NOT NULL,
	`destino` text(40) NOT NULL,
	`terminal_id` integer NOT NULL,
	`provincia_id` integer NOT NULL,
	FOREIGN KEY (`terminal_id`) REFERENCES `terminal`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`provincia_id`) REFERENCES `provincia`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rutas_to_paradas` (
	`id` integer NOT NULL,
	`ruta_id` integer NOT NULL,
	`parada_id` text NOT NULL,
	`orden` integer NOT NULL,
	`regreso` integer NOT NULL,
	PRIMARY KEY(`id`, `parada_id`, `ruta_id`),
	FOREIGN KEY (`ruta_id`) REFERENCES `ruta`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`parada_id`) REFERENCES `parada`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `terminal` (
	`id` integer PRIMARY KEY NOT NULL,
	`nombre` text(50) NOT NULL,
	`abreviatura` text(5) NOT NULL,
	`direccion` text(100) NOT NULL,
	`x` real NOT NULL,
	`y` real NOT NULL,
	`provincia_id` integer NOT NULL,
	FOREIGN KEY (`provincia_id`) REFERENCES `provincia`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `provincia_abreviatura_unique` ON `provincia` (`abreviatura`);--> statement-breakpoint
CREATE UNIQUE INDEX `terminal_abreviatura_unique` ON `terminal` (`abreviatura`);