import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ProductsService } from '../../shared/services/products.service';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import { CardComponent } from './components/card/card.component';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../shared/interfaces/products.interface';
import {MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { filter } from 'rxjs';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
  <h2 mat-dialog-title>Deletar Produto</h2>
  <mat-dialog-content>
  Tem certeza que quer deleter este produto?
</mat-dialog-content>
  <mat-dialog-actions align="center">
    <button mat-button (click)="onNo()">Não</button>
    <button mat-raised-button color="accent" (click)="onYes()" cdkFocusInitial>Sim</button>
  </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
})
export class ConfirmationDialogComponent {
  MatDialogRef = inject(MatDialogRef)

  onNo(){
    this.MatDialogRef.close(false);
  }

  onYes(){
    this.MatDialogRef.close(true);
  }
  
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CardComponent, RouterLink, MatButtonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  products: any[] = []; 
  
  productsService = inject(ProductsService);
  
  router = inject(Router);
  matDialog = inject(MatDialog);
  
  ngOnInit(){
    this.productsService.getAll().subscribe((products) =>{
      this.products = products;
    });
  }
  onEdit(product: Product){
    
    this.router.navigate(['/edit-product',product.id])
  }

  onDelete(product: Product) {
      this.matDialog.open(ConfirmationDialogComponent)
      .afterClosed()
      .pipe(filter(answer => answer === true))
      .subscribe(() =>  {
       this.productsService.delete(product.id).subscribe(()=>{
        this.productsService.getAll().subscribe((products) =>{
          this.products = products;
        });
       }); 
   
      })
  }
  
}
