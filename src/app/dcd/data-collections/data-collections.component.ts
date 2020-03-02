import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  IterableDiffers,
  IterableDiffer
} from '@angular/core';
import { DataCollection, Property } from '../classes';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'dcd-data-collections',
  templateUrl: './data-collections.component.html',
  styleUrls: ['./data-collections.component.css']
})
export class DataCollectionsComponent implements OnInit {
  @Input() properties: Property[];
  @Input() precision_ms: number = 300000; //5min default
  entries: { value: any; entity: any }[] = [];
  data_collections: DataCollection[] = [];
  display_property: boolean = false;
  property_picked: Property = new Property({});
  now: Date = new Date();

  private differ: IterableDiffer<Property>;

  constructor(
    private datepipe: DatePipe,
    private differs: IterableDiffers,
    private router: Router
  ) {
    this.differ = this.differs.find([]).create(null);
  }

  ngOnInit() {}

  ngDoCheck(): void {
    if (this.differ) {
      const changes = this.differ.diff(this.properties);
      if (changes) {
        if (changes['collection']) {
          this.data_collections = [];
          this.entries = [];
          changes['collection'].forEach((property, index_properties) => {
            property.values.forEach((value, index_values) => {
              let entrie = {
                value: value,
                entity: property
              };

              if (this.entries.length == 0) {
                this.entries.push(entrie);
              } else {
                this.entries.forEach((e, i) => {
                  if (entrie.value[0] < e.value[0]) {
                    this.entries.splice(i, 0, entrie);
                  } else {
                    if (i == this.entries.length - 1) {
                      this.entries.push(entrie);
                      if (
                        index_properties == changes['collection'].length - 1 &&
                        index_values == property.values.length - 1
                      ) {
                        this.FillArrayDataCollection(); //1min
                      }
                    }
                  }
                });
              }
            });
          });
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.properties) {
      this.data_collections = [];
      this.entries = [];
      changes.properties.currentValue.forEach((property, index_properties) => {
        property.values.forEach((value, index_values) => {
          let entrie = {
            value: value,
            entity: property
          };

          if (this.entries.length == 0) {
            this.entries.push(entrie);
          } else {
            this.entries.forEach((e, i) => {
              if (entrie.value[0] < e.value[0]) {
                this.entries.splice(i, 0, entrie);
              } else {
                if (i == this.entries.length - 1) {
                  this.entries.push(entrie);
                  if (
                    index_properties ==
                      changes.properties.currentValue.length - 1 &&
                    index_values == property.values.length - 1
                  ) {
                    this.FillArrayDataCollection();
                  }
                }
              }
            });
          }
        });
      });
    }
  }

  FillArrayDataCollection() {
    this.entries.forEach((entrie, index_entries) => {
      if (this.data_collections.length == 0) {
        this.data_collections.push(
          new DataCollection(entrie.value[0], entrie.value[0], [
            new Property({
              id: entrie.entity.id,
              name: entrie.entity.name,
              type: entrie.entity.type,
              description: entrie.entity.description,
              dimensions: entrie.entity.dimensions,
              entityId: entrie.entity.entity_id,
              values: [entrie.value]
            })
          ])
        );
      } else {
        const current_ts = this.data_collections[
          this.data_collections.length - 1
        ].to;
        if (current_ts + this.precision_ms > entrie.value[0]) {
          this.data_collections[this.data_collections.length - 1].to =
            entrie.value[0];

          if (
            this.data_collections[this.data_collections.length - 1].contains(
              entrie.entity.id
            )
          ) {
            this.data_collections[
              this.data_collections.length - 1
            ].properties.forEach((property) => {
              if (property.id == entrie.entity.id) {
                property.values.push(entrie.value);
              }
            });
          } else {
            this.data_collections[
              this.data_collections.length - 1
            ].properties.push(
              new Property({
                id: entrie.entity.id,
                name: entrie.entity.name,
                type: entrie.entity.type,
                description: entrie.entity.description,
                dimensions: entrie.entity.dimensions,
                entityId: entrie.entity.entity_id,
                values: [entrie.value]
              })
            );
          }
        } else {
          this.data_collections.push(
            new DataCollection(entrie.value[0], entrie.value[0], [
              new Property({
                id: entrie.entity.id,
                name: entrie.entity.name,
                type: entrie.entity.type,
                description: entrie.entity.description,
                dimensions: entrie.entity.dimensions,
                entityId: entrie.entity.entity_id,
                values: [entrie.value]
              })
            ])
          );
        }
      }
      if (index_entries == this.entries.length - 1) {
        this.data_collections[this.data_collections.length - 1].to =
          entrie.value[0];
      }
    });
  }

  descriptionP(property: Property): string {
    if (property.description) {
      return property.description;
    } else {
      return 'No description available';
    }
  }

  async setChild(property: Property) {
    this.property_picked = property;
  }

  showDialog_property(property: Property) {
    this.setChild(property).then(() => (this.display_property = true));
  }

  nav_thing(collection: DataCollection) {
    this.router.navigate(['/page/thing'], {
      state: {
        data: {
          name: this.getName(collection),
          properties: collection.properties
        },
        range: [collection.from, collection.to]
      }
    });
  }

  getName(collection: DataCollection) {
    let from_date = new Date(collection.from);
    let from_date_pipe = this.datepipe.transform(
      from_date,
      'yyyy-MM-dd HH:mm:ss'
    );
    let to_date = new Date(collection.to);
    let to_date_pipe = this.datepipe.transform(to_date, 'yyyy-MM-dd HH:mm:ss');
    if (from_date.getFullYear() === to_date.getFullYear()) {
      let from_date_pipe_1 = this.datepipe.transform(
        from_date,
        'MM-dd HH:mm:ss'
      );
      let to_date_pipe_1 = this.datepipe.transform(to_date, 'MM-dd HH:mm:ss');
      if (from_date.getMonth() === to_date.getMonth()) {
        let from_date_pipe_2 = this.datepipe.transform(
          from_date,
          'dd HH:mm:ss'
        );
        let to_date_pipe_2 = this.datepipe.transform(to_date, 'dd HH:mm:ss');
        if (from_date.getDay() === to_date.getDay()) {
          let from_date_pipe_3 = this.datepipe.transform(from_date, 'HH:mm:ss');
          let to_date_pipe_3 = this.datepipe.transform(to_date, 'HH:mm:ss');
          return 'from ' + from_date_pipe_3 + ' to ' + to_date_pipe_3;
        } else {
          return 'from ' + from_date_pipe_2 + ' to ' + to_date_pipe_2;
        }
      } else {
        return 'from ' + from_date_pipe_1 + ' to ' + to_date_pipe_1;
      }
    } else {
      return 'from ' + from_date_pipe + ' to ' + to_date_pipe;
    }
  }
}
