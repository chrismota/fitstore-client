import { Injectable, signal } from '@angular/core';
import { DropdownItem } from '../../../models/dropdownItem.model';

@Injectable({
  providedIn: 'root',
})
export class DropdownDataService {
  private _dropdownItems = signal<DropdownItem[]>([
    {
      id: '1',
      label: 'Aeróbicos',
      dropsideItems: [
        { subCategory: 'esteira', name: 'Esteiras' },
        { subCategory: 'eliptico', name: 'Elipticos' },
        { subCategory: 'bicicleta', name: 'Bicicletas' },
      ],
    },
    {
      id: '2',
      label: 'Acessórios',
      dropsideItems: [
        { subCategory: 'barra', name: 'Barras' },
        { subCategory: 'suporte', name: 'Suportes' },
        { subCategory: 'puxador', name: 'Puxadores' },
        { subCategory: 'bola', name: 'Bolas' },
        { subCategory: 'colchonete', name: 'Colchonetes' },
        { subCategory: 'caneleira', name: 'Caneleiras' },
        { subCategory: 'corda', name: 'Cordas' },
      ],
    },
    {
      id: '3',
      label: 'Pesos',
      dropsideItems: [
        { subCategory: 'halter', name: 'Halteres' },
        { subCategory: 'anilha', name: 'Anilhas' },
        { subCategory: 'kettlebell', name: 'Kettlebells' },
        { subCategory: 'presilha', name: 'Presilhas' },
      ],
    },
    {
      id: '4',
      label: 'Suplementos',
      dropsideItems: [
        { subCategory: 'whey', name: 'Whey' },
        { subCategory: 'creatina', name: 'Creatina' },
        { subCategory: 'pre_treino', name: 'Pré-Treino' },
      ],
    },
    {
      id: '5',
      label: 'Roupas',
      dropsideItems: [
        { subCategory: 'camisa', name: 'Camisas' },
        { subCategory: 'short', name: 'Shorts' },
        { subCategory: 'legging', name: 'Leggings' },
      ],
    },
  ]);

  dropdownItems = this._dropdownItems.asReadonly();
}
