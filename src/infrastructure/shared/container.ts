// Repositorios
import { PrismaProductRepository } from "../database/repositories/prismaProductRepository";
import { PrismaUserRepository } from "../database/repositories/prismaUserRepository";
import { PrismaLandingSectionRepository } from "../database/repositories/prismaLandingSectionRepository";

// Servicios
import { BcryptPasswordService } from "./utils/passwordServices";
import { JwtTokenServices } from "./utils/jwtServices";
import { ImageUploadService } from "../shared/imageUploadService";

// User Use Cases
import { CreateUserUseCase } from "../../core/users/application/createUserUseCase";
import { DeactivateUserUseCase } from "../../core/users/application/deactivateUserUseCase";
import { GetAllUserUseCase } from "../../core/users/application/getAllUsersUseCase";
import { GetUserByIdUseCase } from "../../core/users/application/getuserByIdUseCase";
import { UpdateUserUseCase } from "../../core/users/application/updateUserUseCase";

// Product Use Cases
import { CreateProductUseCase } from "../../core/products/application/createProductUsecase";
import { DeactivateProductUseCase } from "../../core/products/application/deactivateProductUseCase";
import { GetAllProductsUseCase } from "../../core/products/application/getAllProductsUseCase";
import { GetProductByIdUseCase } from "../../core/products/application/getProductByIdUseCase";
import { UpdateProductUseCase } from "../../core/products/application/udpateProductUseCase";

// Auth Use Cases
import { LoginUseCase } from "../../core/auth/application/loginUseCase";
import { RegisterUserUseCase } from "../../core/auth/application/registerUserUseCase";

// LandingSection USe Cases
import { CreateLandingSectionUseCase } from "../../core/landingSection/application/createLandingSectionUseCase";
import { GetAllLandingSectionsUseCase } from "../../core/landingSection/application/getAllLangindSections";
import { UpdateLandingSectionUseCase } from "../../core/landingSection/application/updatelandingSectionUseCase";
import { GetLandingSectionByIdUseCase } from "../../core/landingSection/application/getLandingSectionByIdUseCase";

// Controllers
import { ProductController } from "../http/controller/productController";
import { UserController } from "../http/controller/userController";
import { AuthController } from "../http/controller/authController";
import { LandingSectionController } from "../http/controller/landingSectionController";

class DependenciesController {
  // =====================
  // INFRASTRUCTURE
  // =====================
  public readonly productRepository = new PrismaProductRepository();
  public readonly userRepository = new PrismaUserRepository();
  public readonly landingSectionRepository =
    new PrismaLandingSectionRepository();

  public readonly passwordService = new BcryptPasswordService();
  public readonly jwtTokenService = new JwtTokenServices();
  public readonly imageUploadService = new ImageUploadService();

  // =====================
  // PRODUCT USE CASES
  // =====================
  public readonly createProductUseCase = new CreateProductUseCase(
    this.productRepository,
  );

  public readonly getAllProductsUseCase = new GetAllProductsUseCase(
    this.productRepository,
  );

  public readonly getProductByIdUseCase = new GetProductByIdUseCase(
    this.productRepository,
  );

  public readonly updateProductUseCase = new UpdateProductUseCase(
    this.productRepository,
  );

  public readonly deactivateProductUseCase = new DeactivateProductUseCase(
    this.productRepository,
  );

  // =====================
  // USER USE CASES
  // =====================
  public readonly createUserUseCase = new CreateUserUseCase(
    this.userRepository,
    this.passwordService,
  );

  public readonly getAllUsersUseCase = new GetAllUserUseCase(
    this.userRepository,
  );

  public readonly getUserByIdUseCase = new GetUserByIdUseCase(
    this.userRepository,
  );

  public readonly updateUserUseCase = new UpdateUserUseCase(
    this.userRepository,
    this.passwordService,
  );

  public readonly deactivateUserUseCase = new DeactivateUserUseCase(
    this.userRepository,
  );

  // =====================
  // AUTH USE CASES
  // =====================
  public readonly loginUseCase = new LoginUseCase(
    this.userRepository,
    this.passwordService,
    this.jwtTokenService,
  );

  public readonly registerUserUseCase = new RegisterUserUseCase(
    this.userRepository,
    this.passwordService,
  );

  // =====================
  // LANDINGSECTION USE CASES
  // =====================
  public readonly createLandingSection = new CreateLandingSectionUseCase(
    this.landingSectionRepository,
  );
  public readonly getAllLandingSection = new GetAllLandingSectionsUseCase(
    this.landingSectionRepository,
  );
  public readonly updateLandingSection = new UpdateLandingSectionUseCase(
    this.landingSectionRepository,
  );

  public readonly getLandingSectionById = new GetLandingSectionByIdUseCase(
    this.landingSectionRepository,
  );

  // =====================
  // CONTROLLERS
  // =====================

  public readonly productController = new ProductController(
    this.createProductUseCase,
    this.getAllProductsUseCase,
    this.getProductByIdUseCase,
    this.updateProductUseCase,
    this.deactivateProductUseCase,
    this.imageUploadService,
  );

  public readonly userController = new UserController(
    this.createUserUseCase,
    this.deactivateUserUseCase,
    this.getAllUsersUseCase,
    this.getUserByIdUseCase,
    this.updateUserUseCase,
  );

  public readonly authController = new AuthController(
    this.registerUserUseCase,
    this.loginUseCase,
  );

  public readonly landingSectionController = new LandingSectionController(
    this.createLandingSection,
    this.getAllLandingSection,
    this.updateLandingSection,
    this.getLandingSectionById,
    this.imageUploadService,
  );
}

export const container = new DependenciesController();
